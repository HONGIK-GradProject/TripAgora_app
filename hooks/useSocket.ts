import { useSocketContext } from '../contexts/SocketContext';

/**
 * Socket 컨텍스트에 쉽게 접근하기 위한 커스텀 훅입니다.
 * 이 훅을 사용하는 컴포넌트는 SocketProvider 하위에 있어야 합니다.
 * @returns { socket, isConnected }
 */
export const useSocket = () => {
  return useSocketContext();
};
