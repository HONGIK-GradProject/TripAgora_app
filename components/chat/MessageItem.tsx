import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { ChatMessage } from '../../types/chat';

interface MessageItemProps {
  item: ChatMessage;
  isMyMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, isMyMessage }) => {
  if (isMyMessage) {
    return (
      <View className='flex-row items-end my-2 justify-end'>
        <Text className='text-xs text-gray-400 mr-2 mb-1'>
          {new Date(item.sentAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <View className='max-w-[70%] rounded-2xl px-4 py-3 bg-purple-500 rounded-br-none'>
          <Text className='text-white'>{item.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-row items-start my-2'>
      <Image
        source={{ uri: item.senderImageUrl }}
        style={{ width: 32, height: 32, borderRadius: 16 }}
        className='mr-3'
      />
      <View className='flex-1'>
        <Text className='text-s text-gray-500 mb-1'>{'  ' + item.senderNickname}</Text>
        <View className='flex-row items-end'>
          <View className='max-w-[80%] rounded-2xl px-4 py-3 bg-white rounded-bl-none shadow-sm'>
            <Text className='text-gray-900'>{item.content}</Text>
          </View>
          <Text className='text-xs text-gray-400 ml-2 mb-1'>
            {new Date(item.sentAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MessageItem;
