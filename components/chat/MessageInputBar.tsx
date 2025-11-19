import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const MessageInputBar: React.FC<MessageInputBarProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View className='flex-row items-center px-2 pt-2 pb-2 bg-white border-t border-gray-200'>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder='메시지를 입력하세요...'
        placeholderTextColor='#9CA3AF'
        className='flex-1 bg-gray-100 rounded-2xl px-4 py-3 mr-2 text-base'
        multiline
      />
      <TouchableOpacity
        onPress={onSend}
        className='w-11 h-11 rounded-full items-center justify-center'
        style={{ backgroundColor: '#5B67F5' }}
      >
        <Ionicons name='arrow-up' size={22} color='white' />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInputBar;
