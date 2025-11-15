import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getTokens } from '../lib/tokenStorage';

const WEBSOCKET_URL = process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL + '/connect';

const createStompClient = () => {
  console.log(WEBSOCKET_URL);
  const client = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    connectHeaders: {}, // 연결 시점에 토큰을 설정합니다.
    debug: (str) => {
      console.log('STOMP DEBUG: ', new Date(), str);
    },
    reconnectDelay: 5000, // 5초마다 재연결 시도
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  client.onWebSocketError = (event) => {
    console.error('WebSocket error', event);
  };

  return client;
};

export const stompClient = createStompClient();

// 토큰과 함께 클라이언트를 활성화하는 함수
export const activateClient = async () => {
  const token = (await getTokens()).accessToken;
  if (token) {
    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
    stompClient.activate();
  } else {
    console.log('No access token found, STOMP client not activated.');
  }
};

// 클라이언트를 비활성화하는 함수
export const deactivateClient = () => {
  stompClient.deactivate();
  console.log('STOMP client deactivated.');
};
