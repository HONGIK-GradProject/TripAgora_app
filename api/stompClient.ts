import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getTokens } from '../lib/tokenStorage';

/**
 * @constant WEBSOCKET_URL
 * @description 웹소켓 서버의 기본 URL입니다. 환경 변수 `EXPO_PUBLIC_WEBSOCKET_BASE_URL`을 사용합니다.
 */
const WEBSOCKET_URL = process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL + '/connect';

/**
 * @function createStompClient
 * @description STOMP 클라이언트 인스턴스를 생성하고 초기 설정을 적용합니다.
 * @returns {Client} 설정된 STOMP 클라이언트 인스턴스
 */
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

  /**
   * @callback onStompError
   * @param {IFrame} frame - STOMP 오류 프레임 객체
   * @description STOMP 브로커에서 오류가 발생했을 때 실행되는 콜백 함수입니다.
   */
  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  /**
   * @callback onWebSocketError
   * @param {Event} event - WebSocket 오류 이벤트 객체
   * @description WebSocket 연결에서 오류가 발생했을 때 실행되는 콜백 함수입니다.
   */
  client.onWebSocketError = (event) => {
    console.error('WebSocket error', event);
  };

  return client;
};

/**
 * @constant stompClient
 * @description 애플리케이션 전반에서 사용되는 STOMP 클라이언트의 단일 인스턴스입니다.
 */
export const stompClient = createStompClient();

// 토큰과 함께 클라이언트를 활성화하는 함수
/**
 * @function activateClient
 * @async
 * @description 저장된 액세스 토큰을 사용하여 STOMP 클라이언트를 활성화합니다.
 * 토큰이 존재하면 `connectHeaders`에 `Authorization` 헤더를 설정하고 클라이언트를 활성화합니다.
 * 토큰이 없으면 클라이언트를 활성화하지 않고 콘솔에 경고를 출력합니다.
 */
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
/**
 * @function deactivateClient
 * @description STOMP 클라이언트 연결을 비활성화하고 관련 리소스를 해제합니다.
 */
export const deactivateClient = () => {
  stompClient.deactivate();
  console.log('STOMP client deactivated.');
};
