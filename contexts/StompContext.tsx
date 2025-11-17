import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Client } from '@stomp/stompjs';
import { stompClient, activateClient, deactivateClient } from '../api/stompClient';
import { useAuth } from '../hooks/useAuth';

interface StompContextType {
  client: Client;
  isConnected: boolean;
}

// 컨텍스트 생성
const StompContext = createContext<StompContextType | null>(null);

// StompProvider 컴포넌트
export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); // AuthContext에서 사용자 정보를 가져옵니다.

  useEffect(() => {
    // 연결 상태 변경을 감지하는 리스너 설정
    const onConnected = () => {
      console.log('STOMP client connected.');
      setIsConnected(true);
    };
    const onDisconnected = () => {
      console.log('STOMP client disconnected.');
      setIsConnected(false);
    };

    stompClient.onConnect = onConnected;
    stompClient.onDisconnect = onDisconnected;

    // 사용자가 인증된 상태이면 클라이언트를 활성화하고, 그렇지 않으면 비활성화합니다.
    if (user) {
      activateClient();
    } else {
      deactivateClient();
    }

    // 컴포넌트가 언마운트될 때 정리합니다.
    return () => {
      stompClient.onConnect = () => {};
      stompClient.onDisconnect = () => {};
      if (stompClient.active) {
        deactivateClient();
      }
    };
  }, [user]); // user 상태가 변경될 때마다 이 useEffect가 다시 실행됩니다.

  return (
    <StompContext.Provider value={{ client: stompClient, isConnected }}>
      {children}
    </StompContext.Provider>
  );
};

// 컨텍스트를 쉽게 사용하기 위한 커스텀 훅
export const useStompContext = () => {
  const context = React.useContext(StompContext);
  if (!context) {
    throw new Error('useStompContext must be used within a StompProvider');
  }
  return context;
};
