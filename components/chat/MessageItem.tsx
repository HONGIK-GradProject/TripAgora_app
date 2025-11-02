import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { Message } from '../../types/chat';

interface MessageItemProps {
  item: Message;
  isMyMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, isMyMessage }) => {
  return (
    <View
      className={`flex-row items-end my-2 ${
        isMyMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isMyMessage && (
        <View className='mr-3'>
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </View>
      )}

      {isMyMessage && (
        <Text className='text-xs text-gray-400 mr-2 mb-1'>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}

      <View
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isMyMessage
            ? 'bg-purple-500 rounded-br-none'
            : 'bg-white rounded-bl-none shadow-sm'
        }`}
      >
        <Text className={isMyMessage ? 'text-white' : 'text-gray-900'}>
          {item.text}
        </Text>
      </View>

      {!isMyMessage && (
        <Text className='text-xs text-gray-400 ml-2 mb-1'>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );
};

export default MessageItem;
