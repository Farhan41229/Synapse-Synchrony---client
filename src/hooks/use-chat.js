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
      console.log('Error in fetching Chats', error);
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
      console.log('The result is: ', result);
      console.log('Response from Fetching a Single Chat: ', result);
      set({ singleChat: result });
    } catch (error) {
      console.log('Error in fetching The Single Chat: ', error);
    } finally {
      set({ isSingleChatLoading: false });
    }
  },

  sendMessage: async (payload) => {
    set({ isSendingMsg: true });
    const { chatId, replyTo, content, image, user } = payload;

    if (!chatId || !user?._id) return;

    const tempUserId = generateUUID();

    const tempMessage = {
      _id: tempUserId,
      chatId,
      content: content || '',
      image: image || null,
      sender: user?._id,
      replyTo: replyTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'sending...',
    };

    set((state) => {
      if (state.singleChat?.chat?._id !== chatId) return state;
      return {
        singleChat: {
          ...state.singleChat,
          messages: [...state.singleChat.messages, tempMessage],
        },
      };
    });

    try {
      const { data } = await axios.post(`${API}/chat/create-message`, {
        chatId,
        content,
        image,
        replyToId: replyTo?._id,
      });
      console.log('The result from the Send Message is : ', data);
      const { userMessage } = data?.data;
      //replace the temp user message
      set((state) => {
        if (!state.singleChat) return state;
        return {
          singleChat: {
            ...state.singleChat,
            messages: state.singleChat.messages.map((msg) =>
              msg._id === tempUserId ? userMessage : msg
            ),
          },
        };
      });
    } catch (error) {
      console.log('Error in Sending Message : ', error);
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
        //move the chat to the top
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
    const chat = get().singleChat;
    if (chat?.chat._id === chatId) {
      set({
        singleChat: {
          chat: chat.chat,
          messages: [...chat.messages, message],
        },
      });
    }
  },
}));
