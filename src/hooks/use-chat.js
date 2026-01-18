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

  // ✅ NEW: AI-specific state
  aiChat: null,
  isAIChatLoading: false,
  isSendingAIMsg: false,
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

      // ✅ Check if this is an AI chat and set aiChat accordingly
      const isAIChat = result?.chat?.participants?.some(
        (p) => p.isAI === true || p.name === 'Whoop AI'
      );

      if (isAIChat) {
        console.log('✅ This is an AI chat, setting aiChat state');
        set({ singleChat: result, aiChat: result.chat });
      } else {
        set({ singleChat: result });
      }
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

  // ✅ NEW: Get or create AI chat
  fetchAIChat: async () => {
    set({ isAIChatLoading: true });
    try {
      const { data } = await axios.get(`${API}/chat/ai-chat`);
      console.log('AI Chat fetched:', data);

      const aiChatData = data?.data;

      // Add to chats list if not already there
      if (aiChatData) {
        get().addNewChat(aiChatData);
        set({ aiChat: aiChatData });
      }

      return aiChatData;
    } catch (error) {
      console.error('Error fetching AI chat:', error);
      set({ aiChat: null });
      return null;
    } finally {
      set({ isAIChatLoading: false });
    }
  },

  // ✅ NEW: Send message to AI
  sendAIMessage: async (payload) => {
    console.log('🎯 sendAIMessage called with payload:', payload);

    set({ isSendingAIMsg: true });
    const { content, user, chatId } = payload;

    console.log('📦 Destructured:', { content, user: user?._id, chatId });

    if (!content || !user?._id) {
      console.error('❌ Invalid payload - missing content or user._id');
      set({ isSendingAIMsg: false });
      return;
    }

    console.log('✅ Validation passed, proceeding...');

    // Generate temp IDs for optimistic updates
    const tempUserMsgId = generateUUID();
    const tempAIMsgId = generateUUID();

    // Get AI user info (you might want to fetch this or hardcode it)
    const aiUser = {
      _id: 'ai_user_id', // This will be replaced by real AI user
      name: 'Whoop AI',
      avatar:
        'https://res.cloudinary.com/dp9vvlndo/image/upload/v1759925671/ai_logo_qqman8.png',
    };

    // Create temp user message
    const tempUserMessage = {
      _id: tempUserMsgId,
      chatId: chatId || get().aiChat?._id,
      content,
      sender: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'sending...',
    };

    // Create temp AI message (loading state)
    const tempAIMessage = {
      _id: tempAIMsgId,
      chatId: chatId || get().aiChat?._id,
      content: '⏳ Thinking...',
      sender: aiUser,
      replyTo: { _id: tempUserMsgId },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'generating...',
    };

    console.log('🤖 Sending AI message:', { content, chatId });

    // Optimistically add user message
    set((state) => {
      const targetChatId = chatId || state.aiChat?._id;

      if (!state.singleChat || state.singleChat?.chat?._id !== targetChatId) {
        console.log('Not viewing AI chat currently');
        return state;
      }

      return {
        singleChat: {
          ...state.singleChat,
          messages: [...(state.singleChat.messages || []), tempUserMessage],
        },
        currentAIStreamId: tempAIMsgId,
      };
    });

    // Add "AI is thinking" message after a brief delay
    setTimeout(() => {
      set((state) => {
        const targetChatId = chatId || state.aiChat?._id;

        if (!state.singleChat || state.singleChat?.chat?._id !== targetChatId) {
          return state;
        }

        return {
          singleChat: {
            ...state.singleChat,
            messages: [...(state.singleChat.messages || []), tempAIMessage],
          },
        };
      });
    }, 300);

    try {
      console.log('📡 Making API call to:', `${API}/chat/send-ai-message`);
      console.log('📤 Request payload:', {
        content,
        chatId: chatId || get().aiChat?._id,
      });

      const response = await axios.post(`${API}/chat/send-ai-message`, {
        content,
        chatId: chatId || get().aiChat?._id,
      });

      console.log('📥 Response received:', response);
      console.log('🤖 AI Response data:', response.data);
      console.log(
        '🤖 Full Response Structure:',
        JSON.stringify(response.data, null, 2)
      );

      const apiData = response.data;
      const { userMessage, aiMessage, chat } = apiData?.data || {};

      console.log('👤 userMessage:', userMessage);
      console.log('🤖 aiMessage:', aiMessage);
      console.log('💬 chat:', chat);

      if (!userMessage || !aiMessage) {
        console.error('❌ Invalid AI response structure');
        // Remove temp messages on error
        set((state) => {
          if (!state.singleChat) return state;
          return {
            singleChat: {
              ...state.singleChat,
              messages: (state.singleChat.messages || []).filter(
                (msg) => msg?._id !== tempUserMsgId && msg?._id !== tempAIMsgId
              ),
            },
            currentAIStreamId: null,
          };
        });
        return null;
      }

      console.log('✅ Replacing temp messages with real ones');

      // Update AI chat if returned
      if (chat) {
        set({ aiChat: chat });
        // Also add/update in chats list
        get().addNewChat(chat);
      }

      // Replace temp messages with real ones
      set((state) => {
        const targetChatId = chat?._id || chatId || state.aiChat?._id;

        if (!state.singleChat || state.singleChat?.chat?._id !== targetChatId) {
          return { currentAIStreamId: null };
        }

        const currentMessages = state.singleChat.messages || [];

        // ✅ FIXED: Remove temp messages first, then add real ones
        const filteredMessages = currentMessages.filter(
          (msg) => msg?._id !== tempUserMsgId && msg?._id !== tempAIMsgId
        );

        // Add real messages at the end
        const finalMessages = [...filteredMessages, userMessage, aiMessage];

        console.log('📝 Message replacement:', {
          before: currentMessages.length,
          afterFilter: filteredMessages.length,
          final: finalMessages.length,
          removedTemp: currentMessages.length - filteredMessages.length,
        });

        return {
          singleChat: {
            ...state.singleChat,
            messages: finalMessages,
          },
          currentAIStreamId: null,
        };
      });

      return { userMessage, aiMessage, chat };
    } catch (error) {
      console.error('❌ Error sending AI message:', error);

      // Remove temp messages on error
      set((state) => {
        if (!state.singleChat) {
          return { isSendingAIMsg: false, currentAIStreamId: null };
        }

        return {
          singleChat: {
            ...state.singleChat,
            messages: (state.singleChat.messages || []).filter(
              (msg) => msg?._id !== tempUserMsgId && msg?._id !== tempAIMsgId
            ),
          },
          isSendingAIMsg: false,
          currentAIStreamId: null,
        };
      });

      // Optionally show error message
      const errorMessage = {
        _id: generateUUID(),
        chatId: chatId || get().aiChat?._id,
        content: '❌ Sorry, I encountered an error. Please try again.',
        sender: aiUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'error',
      };

      set((state) => {
        const targetChatId = chatId || state.aiChat?._id;

        if (!state.singleChat || state.singleChat?.chat?._id !== targetChatId) {
          return state;
        }

        return {
          singleChat: {
            ...state.singleChat,
            messages: [...(state.singleChat.messages || []), errorMessage],
          },
        };
      });

      return null;
    } finally {
      set({ isSendingAIMsg: false });
    }
  },

  // ✅ Helper: Check if current chat is AI chat
  isCurrentChatAI: async (chatId) => {
    if (!chatId) {
      console.log('❌ isCurrentChatAI: No chatId provided');
      return false;
    }

    try {
      console.log('🔍 Checking if chat is AI chat:', chatId);

      const { data } = await axios.get(`${API}/chat/ai-chat`);
      const aiChatData = data?.data;

      if (!aiChatData?._id) {
        console.log('❌ No AI chat found');
        return false;
      }

      const isAI = aiChatData._id === chatId;
      console.log('🤖 isCurrentChatAI result:', {
        inputChatId: chatId,
        aiChatId: aiChatData._id,
        isAI,
      });

      // ✅ Also update aiChat state if this is the AI chat
      if (isAI) {
        set({ aiChat: aiChatData });
      }

      return isAI;
    } catch (error) {
      console.error('❌ Error checking if chat is AI:', error);
      return false;
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
