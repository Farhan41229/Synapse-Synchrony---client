import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const getAccessToken = () => useAuthStore.getState().accessToken;

export const getSocket = () => socket;

export const connectSocket = () => {
  // If already connected, return it
  if (socket?.connected) return socket;

  // If created but currently disconnected, just connect again
  if (socket && !socket.connected) {
    socket.connect();
    return socket;
  }

  // Require token before establishing a new connection
  const token = getAccessToken();
  if (!token) {
    throw new Error('Missing access token for socket connection');
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 500,

    // Always read the latest token from the store for (re)connect handshakes
    auth: (cb) => {
      cb({ token: getAccessToken() });
    },
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};
