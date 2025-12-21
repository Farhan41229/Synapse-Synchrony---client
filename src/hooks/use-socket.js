import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
const BASE_URL = 'http://localhost:3001';

export const useSocket = create()((set, get) => ({
  socket: null,
  onlineUser: [],
  connectSocket: () => {
    const { socket } = get();
    console.log('Socket : ', socket);
    if (socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket'], // Explicitly set the transport type
      autoConnect: true,
    });

    set({ socket: newSocket });

    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
    });

    newSocket.on('online:users', (userIds) => {
      console.log('Online users', userIds);
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
