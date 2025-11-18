import { isSameDay, parseISO } from 'date-fns';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ChatMessage } from '../../types/chat';
import MessageInputBar from './MessageInputBar';
import MessageItem from './MessageItem';

// Define the types for the list items
type ListItem = ChatMessage | { type: 'date'; date: string };

interface ChatViewProps {
  messages?: ChatMessage[];
  onSend: (text: string) => void;
  user?: {
    _id: string | number;
  };
  onLoadEarlier?: () => void;
}

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <View className='items-center my-4'>
    <View className='px-4 py-2 bg-gray-200 rounded-full'>
      <Text className='text-xs text-gray-600'>{date}</Text>
    </View>
  </View>
);

const ChatView: React.FC<ChatViewProps> = ({
  messages: propMessages,
  onSend,
  user: propUser,
  onLoadEarlier,
}) => {
  const [inputText, setInputText] = React.useState('');

  const currentUser = propUser || { _id: 'my_user_id' };
  const displayMessages =
    propMessages && propMessages.length > 0 ? propMessages : [];

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const processedMessages: ListItem[] = [];
  if (displayMessages.length > 0) {
    displayMessages.forEach((message, index) => {
      const nextMessage = displayMessages[index + 1];
      processedMessages.push(message);

      if (
        !nextMessage ||
        !isSameDay(parseISO(message.sentAt), parseISO(nextMessage.sentAt))
      ) {
        processedMessages.push({
          type: 'date',
          date: new Date(message.sentAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        });
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={processedMessages}
        renderItem={({ item }) => {
          if ('type' in item && item.type === 'date') {
            return <DateSeparator date={item.date} />;
          } else {
            const messageItem = item as ChatMessage;
            return (
              <MessageItem
                item={messageItem}
                isMyMessage={messageItem.senderId === currentUser._id}
              />
            );
          }
        }}
        keyExtractor={(item) => ('type' in item ? item.date : item.sentAt)}
        className='flex-1 px-4 pt-4'
        inverted
        contentContainerStyle={{ paddingBottom: 10 }}
        onEndReached={onLoadEarlier}
        onEndReachedThreshold={0.5}
      />
      <MessageInputBar
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
      />
    </View>
  );
};

export default ChatView;
