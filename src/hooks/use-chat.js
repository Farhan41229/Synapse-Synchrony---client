import { create } from 'zustand';
import axios from 'axios';
// import { useSocket } from '@/hooks/use-socket';
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

  fetchAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axios.get(`${API}//user/get-users`);
      console.log('Data from fetching All Users : ', data);
      set({ users: data?.data.users });
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
      const response = await axios.post(`${API}/chat/create-chat`, {
        ...payload,
      });
      console.log('Response from Creating Chat: ', response);
      get().addNewChat(response.data?.data?.chat);
      return response.data?.data?.chat;
    } catch (error) {
      console.log('Error in fetching Chats', error);
    } finally {
      set({ isCreatingChat: false });
    }
  },
  fetchSingleChat: async (chatid) => {
    set({ isSingleChatLoading: true });
    try {
      const { data } = await axios.get(`${API}/chat/get-single-chat/${chatid}`);
      console.log('Response from Fetching a Single Chat: ', data);
      set({ singleChat: data?.data?.chat });
    } catch (error) {
      console.log('Error in fetching The Single Chat: ', error);
    } finally {
      set({ isSingleChatLoading: false });
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
}));
