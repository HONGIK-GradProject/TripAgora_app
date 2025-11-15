import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useAuth } from '@/hooks/useAuth';
import { useStomp } from '@/hooks/useStomp';
import { getPreviousChat } from '@/services/chat';
import { ChatMessage } from '@/types/chat';
import { Message } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatView from '../chat/ChatView';

const ChatRoom: React.FC<{ roomId: number }> = ({ roomId }) => {
  const { user } = useAuth();
  const { bottom } = useSafeAreaInsets();

  const { client, isConnected } = useStomp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (isConnected && roomId) {
      const destination = `/topic/room/${roomId}`;

      const subscription = client.subscribe(destination, (message: Message) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        setMessages(prevMessages => [receivedMessage, ...prevMessages]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConnected, client, roomId]);

  useEffect(() => {
    const fetchPreviousChat = async () => {
      try {
        const prevMessages = (await getPreviousChat(roomId))?.messages;

        if (prevMessages && prevMessages.length > 0) {
          setMessages(prevMessages);
        }
      } catch (error) {
        console.log('Error fetching previous chat:', error);
      }
    };

    fetchPreviousChat();
  }, [roomId]);

  const handleSendMessage = (text: string) => {
    if (isConnected && user) {
      client.publish({
        destination: `/publish/room/${roomId}`,
        body: JSON.stringify({ content: text }),
      });
    }
  };


  return (
    <CustomSafeAreaView>
      <ChatView
        messages={messages}
        onSend={handleSendMessage}
        user={{
          _id: user ? (user.id || 123123123) : 123123123
        }}
      />
    </CustomSafeAreaView>
  );
};

export default ChatRoom;
