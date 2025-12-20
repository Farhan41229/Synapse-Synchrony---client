import { useEffect, useMemo, useState } from 'react';
import  toast  from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';
import { SocketContext } from './SocketContext';

const SocketProvider = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only sync external system (socket) to auth state here.
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    let s;
    try {
      s = connectSocket();
    } catch (err) {
      disconnectSocket();
      const msg = String(err?.message || '');
      // During app boot, token can be temporarily null while refresh is happening.
      if (!msg.toLowerCase().includes('missing access token')) {
        toast.error(msg || 'Socket connection failed');
      }
      return;
    }

    // Update React state ONLY from external callbacks
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnectError = () => setConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', onConnectError);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('connect_error', onConnectError);
    };
  }, [isAuthenticated, accessToken]);

  const socket = getSocket();
  const isConnected = connected && !!socket?.connected;

  const value = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
