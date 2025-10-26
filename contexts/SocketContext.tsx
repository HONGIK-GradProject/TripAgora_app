import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, socket } from '../services/socket';

interface ISocketContext {
  socket: Socket;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // 연결 상태 리스너
    const onConnect = () => {
      console.log('Socket connection status: connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket connection status: disconnected');
      setIsConnected(false);
    };

    // 소켓 이벤트 리스너 등록
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', err => console.error(err));
    socket.on('connect_failed', err => console.error(err));

    // 수동으로 소켓 연결 시작
    connectSocket();

    // 컴포넌트 언마운트 시 리스너 정리 및 연결 해제
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      disconnectSocket();
    };
  }, []);

  const value = { socket, isConnected };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
