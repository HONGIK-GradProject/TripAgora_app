import { useStompContext } from '../contexts/StompContext';

/**
 * STOMP 클라이언트 인스턴스와 연결 상태에 접근하기 위한 커스텀 훅입니다.
 * 이 훅은 반드시 StompProvider 내부에서 사용되어야 합니다.
 * @returns \{ client, isConnected }
 */
export const useStomp = () => {
  return useStompContext();
};
