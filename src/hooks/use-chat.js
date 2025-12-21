import { create } from 'zustand';
import axios from 'axios';

import { generateUUID } from '@/lib/helper';
export const API = 'http://localhost:3001/api';
axios.defaults.withCredentials = true;

export const useChat = create((set, get) => ({
  chats: [],
  users: [],
  singleChat: null,

  isUsersLoading: false,
  isChatsLoading: false,
  isCreatingChat: false,
  isSingleChatLoading: false,
  isSendingMsg: false,

  currentAIStreamId: null,

  fetchAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axios.get(`${API}/user/get-users`);
      console.log('Data from fetching All Users : ', data);
      set({ users: data?.data });
    } catch (error) {
      console.log('Error in fetching All Users', error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  fetchChats: async () => {
    set({ isChatsLoading: true });
    try {
      const { data } = await axios.get(`${API}/chat/get-user-chats`);
      console.log('Data from fetching User Chats', data);
      set({ chats: data?.data });
    } catch (error) {
      console.log('Error in fetching Chats', error);
    } finally {
      set({ isChatsLoading: false });
    }
  },

  createChat: async (payload) => {
    set({ isCreatingChat: true });
    try {
      console.log('The payload recieved is : ', payload);
      const response = await axios.post(`${API}/chat/create-chat`, {
        ...payload,
      });
      console.log('Response from Creating Chat: ', response);
      get().addNewChat(response.data?.data);
      return response.data?.data;
    } catch (error) {
      console.log('Error in creating Chat', error);
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },

  fetchSingleChat: async (chatid) => {
    set({ isSingleChatLoading: true });
    try {
      const { data } = await axios.get(`${API}/chat/get-single-chat/${chatid}`);
      const result = data?.data;
      console.log('Response from Fetching a Single Chat: ', result);
      set({ singleChat: result });
    } catch (error) {
      console.log('Error in fetching The Single Chat: ', error);
      set({ singleChat: null });
    } finally {
      set({ isSingleChatLoading: false });
    }
  },

  sendMessage: async (payload) => {
    set({ isSendingMsg: true });
    const { chatId, replyTo, content, image, user } = payload;

    console.log('ReplyTo from payload: ', replyTo);

    if (!chatId || !user?._id) {
      set({ isSendingMsg: false });
      return;
    }

    const tempUserId = generateUUID();

    const tempMessage = {
      _id: tempUserId,
      chatId,
      content: content || '',
      image: image || null,
      sender: user,
      replyTo: replyTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'sending...',
    };

    console.log('Adding temp message:', tempMessage);

    // Add temp message optimistically
    set((state) => {
      if (!state.singleChat || state.singleChat?.chat?._id !== chatId) {
        console.log('Chat ID mismatch or no singleChat');
        return state;
      }

      const currentMessages = state.singleChat.messages || [];

      console.log('Current messages:', currentMessages);
      console.log('Adding temp message to array');

      return {
        singleChat: {
          ...state.singleChat,
          messages: [...currentMessages, tempMessage],
        },
      };
    });
    console.log('Debugging Reply to : ', replyTo);
    try {
      const response = await axios.post(`${API}/chat/create-message`, {
        chatId,
        content,
        image,
        replyTo: replyTo,
      });

      console.log('Full axios response:', response);
      console.log('Response data:', response.data);

      // ✅ FIXED: Axios response structure is { data: { error, message, data } }
      // So response.data is your API response
      // And response.data.data contains your actual data
      const apiData = response.data;
      console.log('API data:', apiData);

      const userMessage = apiData?.data;
      console.log('Extracted userMessage:', userMessage);

      if (!userMessage) {
        console.error('No userMessage found in response');
        console.error('Full response.data:', apiData);
        // Remove temp message on error
        set((state) => {
          if (!state.singleChat) return state;
          return {
            singleChat: {
              ...state.singleChat,
              messages: (state.singleChat.messages || []).filter(
                (msg) => msg?._id !== tempUserId
              ),
            },
          };
        });
        return;
      }

      console.log('Replacing temp message with real message:', userMessage);

      // Replace the temp user message with real one
      set((state) => {
        if (!state.singleChat) return state;

        const currentMessages = state.singleChat.messages || [];

        return {
          singleChat: {
            ...state.singleChat,
            messages: currentMessages.map((msg) =>
              msg?._id === tempUserId ? userMessage : msg
            ),
          },
        };
      });
    } catch (error) {
      console.log('Error in Sending Message : ', error);

      // Remove the temp message on error
      set((state) => {
        if (!state.singleChat) return state;

        return {
          singleChat: {
            ...state.singleChat,
            messages: (state.singleChat.messages || []).filter(
              (msg) => msg?._id !== tempUserId
            ),
          },
        };
      });
    } finally {
      set({ isSendingMsg: false });
    }
  },

  addNewChat: (newChat) => {
    set((state) => {
      const existingChatIndex = state.chats.findIndex(
        (c) => c._id === newChat._id
      );
      if (existingChatIndex !== -1) {
        return {
          chats: [newChat, ...state.chats.filter((c) => c._id !== newChat._id)],
        };
      } else {
        return {
          chats: [newChat, ...state.chats],
        };
      }
    });
  },

  updateChatLastMessage: (chatId, lastMessage) => {
    set((state) => {
      const chat = state.chats.find((c) => c._id === chatId);
      if (!chat) return state;
      return {
        chats: [
          { ...chat, lastMessage },
          ...state.chats.filter((c) => c._id !== chatId),
        ],
      };
    });
  },

  addNewMessage: (chatId, message) => {
    const state = get();
    const chat = state.singleChat;

    if (chat?.chat?._id === chatId) {
      const currentMessages = chat.messages || [];

      set({
        singleChat: {
          chat: chat.chat,
          messages: [...currentMessages, message],
        },
      });
    }
  },
}));
