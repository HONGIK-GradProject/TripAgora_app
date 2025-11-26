import { useAuth } from '@/hooks/useAuth';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useStomp } from '@/hooks/useStomp';
import { fetchPreviousChat } from '@/services/chat';
import { ChatMessage } from '@/types/chat';
import { Message } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import ChatView from '../chat/ChatView';

/**
 * @interface ChatRoomProps
 * @description ChatRoom 컴포넌트의 속성(props)을 정의합니다.
 * @property {number} roomId - 현재 채팅방의 고유 ID.
 */
interface ChatRoomProps {
  roomId: number;
}

/**
 * @function ChatRoom
 * @description 특정 채팅방의 메시지를 표시하고 관리하는 React 함수형 컴포넌트입니다.
 * STOMP를 통해 실시간 메시지를 수신하고, 이전 메시지를 페이지네이션하여 로드하며, 메시지 전송 기능을 제공합니다.
 * @param {ChatRoomProps} { roomId } - 컴포넌트 속성으로 채팅방 ID를 받습니다.
 * @returns {JSX.Element} ChatRoom 컴포넌트.
 */
const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { client, isConnected } = useStomp();

  /**
   * @property {ChatMessage[]} newMessages - 실시간으로 수신되는 새로운 메시지 목록.
   * @property {React.Dispatch<React.SetStateAction<ChatMessage[]>>} setNewMessages - `newMessages` 상태를 업데이트하는 함수.
   */
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const {
    items: paginatedMessages,
    loadMore,
    refetch,
    hasNextPage,
  } = usePaginatedList(fetchPreviousChat);

  /**
   * @useEffect
   * @description `roomId`가 변경될 때 이전 채팅 메시지를 다시 가져옵니다.
   * `refetch` 함수를 사용하여 지정된 `roomId`에 대한 메시지를 불러옵니다.
   */
  useEffect(() => {
    if (roomId) {
      refetch(roomId);
    }
  }, [roomId, refetch]);

  /**
   * @useEffect
   * @description STOMP 연결 상태, 클라이언트 연결 여부, `roomId`에 따라 채팅 메시지를 구독하고 수신합니다.
   * 구독 해지를 위한 클린업 함수를 반환하여 컴포넌트 언마운트 시 리소스를 정리합니다.
   */
  useEffect(() => {
    if (isConnected && client.connected && roomId) {
      const destination = `/topic/room/${roomId}/chat`;

      const subscription = client.subscribe(destination, (message: Message) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        console.log('Received Message', receivedMessage.content);
        receivedMessage.sentAt += 'Z';
        setNewMessages(prevMessages => [receivedMessage, ...prevMessages]);
      });

      return () => {
        if (client.connected) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, client, roomId]);

  /**
   * @function handleSendMessage
   * @param {string} text - 전송할 메시지 내용.
   * @description STOMP 클라이언트를 통해 메시지를 게시합니다.
   * 클라이언트가 연결되어 있고 사용자 정보가 있을 경우에만 메시지를 전송합니다.
   */
  const handleSendMessage = (text: string) => {
    if (isConnected && client.connected && user) {
      client.publish({
        destination: `/publish/room/${roomId}/chat`,
        body: JSON.stringify({ content: text }),
      });
    }
  };

  /**
   * @function handleLoadEarlier
   * @description `usePaginatedList` 훅을 사용하여 이전 메시지를 더 로드합니다.
   * `hasNextPage`가 true일 경우에만 작동합니다.
   */
  const handleLoadEarlier = () => {
    if (hasNextPage) {
      loadMore(roomId);
    }
  };

  /**
   * @constant paginatedMessageIds
   * @description 페이지네이션된 메시지들의 ID를 저장하는 Set. 중복 메시지 필터링에 사용됩니다.
   */
  const paginatedMessageIds = new Set(
    paginatedMessages.map((msg) => msg.chatMessageId)
  );
  /**
   * @constant uniqueNewMessages
   * @description 페이지네이션된 메시지들과 중복되지 않는 새로운 메시지 목록.
   */
  const uniqueNewMessages = newMessages.filter(
    (msg) => !paginatedMessageIds.has(msg.chatMessageId)
  );
  /**
   * @constant allMessages
   * @description 새로 수신된 메시지와 페이지네이션된 이전 메시지를 합친 전체 메시지 목록.
   */
  const allMessages = [...uniqueNewMessages, ...paginatedMessages];

  return (
    <ChatView
      messages={allMessages}
      onSend={handleSendMessage}
      user={{
        _id: (user && user.id) ? user.id : ''
      }}
      onLoadEarlier={handleLoadEarlier}
    />
  );
};

export default ChatRoom;
