import { useAuth } from '@/hooks/useAuth';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useStomp } from '@/hooks/useStomp';
import { fetchPreviousChat } from '@/services/chat';
import { ChatMessage } from '@/types/chat';
import { Message } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import ChatView from '../chat/ChatView';

interface ChatRoomProps {
  roomId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { client, isConnected } = useStomp();

  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const {
    items: paginatedMessages,
    loadMore,
    refetch,
    hasNextPage,
  } = usePaginatedList(fetchPreviousChat);

  useEffect(() => {
    if (roomId) {
      refetch(roomId);
    }
  }, [roomId, refetch]);

  useEffect(() => {
    if (isConnected && roomId) {
      const destination = `/topic/room/${roomId}/chat`;

      const subscription = client.subscribe(destination, (message: Message) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        receivedMessage.sentAt += 'Z';
        setNewMessages(prevMessages => [receivedMessage, ...prevMessages]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConnected, client, roomId]);

  const handleSendMessage = (text: string) => {
    if (isConnected && user) {
      client.publish({
        destination: `/publish/room/${roomId}/chat`,
        body: JSON.stringify({ content: text }),
      });
    }
  };

  const handleLoadEarlier = () => {
    if (hasNextPage) {
      loadMore(roomId);
    }
  };

  const paginatedMessageIds = new Set(
    paginatedMessages.map((msg) => msg.chatMessageId)
  );
  const uniqueNewMessages = newMessages.filter(
    (msg) => !paginatedMessageIds.has(msg.chatMessageId)
  );
  const allMessages = [...uniqueNewMessages, ...paginatedMessages];

  return (
    <ChatView
      messages={allMessages}
      onSend={handleSendMessage}
      user={{
        _id: user ? (user.id || '') : ''
      }}
      onLoadEarlier={handleLoadEarlier}
    />
  );
};

export default ChatRoom;
