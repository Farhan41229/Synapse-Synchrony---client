import { createContext } from 'react';

/**
 * { socket, isConnected }
 * - socket: Socket.IO client instance (or null before connect)
 * - isConnected: boolean
 */
export const SocketContext = createContext(undefined);
