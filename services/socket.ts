import { getTokens } from '@/lib/tokenStorage';
import { io, Socket } from 'socket.io-client';

// 1. 소켓 클라이언트 생성 및 내보내기
//    - 여러 컴포넌트에서 동일한 소켓 인스턴스를 공유하기 위해 싱글톤으로 관리합니다.
//    - autoConnect: false로 설정하여 수동으로 연결을 관리합니다.
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_BASE_URL;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'], // 성능을 위해 웹소켓을 우선적으로 사용
});

export const connectSocket = async () => {
  if (!socket.connected) {
    const { accessToken } = await getTokens();

    if (accessToken) {
      socket.auth = { token: accessToken };
      socket.connect();
      console.log('Socket connected with auth token.');
    } else {
      console.error('Socket connection failed: No access token found.');
    }
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

export const listenOn = (event: string, listener: (...args: any[]) => void) => {
  if (!socket.hasListeners(event)) {
    socket.on(event, listener);
  }
};

export const listenOff = (event: string, listener: (...args: any[]) => void) => {
  socket.off(event, listener);
};

export const emitEvent = (event: string, ...args: any[]) => {
  if (socket.connected) {
    socket.emit(event, ...args);
  } else {
    console.warn(`Socket not connected. Event "${event}" was not sent.`);
  }
};
