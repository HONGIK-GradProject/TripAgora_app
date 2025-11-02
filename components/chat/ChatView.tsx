import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Message } from '../../types/chat';
import MessageInputBar from './MessageInputBar';
import MessageItem from './MessageItem';


// Mock data for demonstration
const mockMessages: Message[] = [
  {
    _id: '1',
    text: '안녕하세요! 여행 관련해서 질문이 있습니다.',
    createdAt: new Date(Date.now() - 60 * 1000 * 5), // 5 minutes ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300', // Example avatar
    },
  },
  {
    _id: '2',
    text: '네, 안녕하세요! 무엇이든 물어보세요.',
    createdAt: new Date(Date.now() - 60 * 1000 * 4), // 4 minutes ago
    user: {
      _id: 'my_user_id',
      name: '나',
      avatar: 'https://picsum.photos/id/238/200/300', // Example avatar
    },
  },
  {
    _id: '3',
    text: '혹시 여행 일정 변경이 가능한가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 3), // 3 minutes ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
  {
    _id: '4',
    text: '네, 가능합니다. 어떤 날짜로 변경하고 싶으신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 2), // 2 minutes ago
    user: {
      _id: 'my_user_id',
      name: '나',
      avatar: 'https://picsum.photos/id/238/200/300',
    },
  },
  {
    _id: '5',
    text: '다음 주 주말은 어떠신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 1), // 1 minute ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
  {
    _id: '6',
    text: '안녕하세요! 여행 관련해서 질문이 있습니다.',
    createdAt: new Date(Date.now() - 60 * 1000 * 5), // 5 minutes ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300', // Example avatar
    },
  },
  {
    _id: '7',
    text: '네, 안녕하세요! 무엇이든 물어보세요.',
    createdAt: new Date(Date.now() - 60 * 1000 * 4), // 4 minutes ago
    user: {
      _id: 'my_user_id',
      name: '나',
      avatar: 'https://picsum.photos/id/238/200/300', // Example avatar
    },
  },
  {
    _id: '8',
    text: '혹시 여행 일정 변경이 가능한가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 3), // 3 minutes ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
  {
    _id: '9',
    text: '네, 가능합니다. 어떤 날짜로 변경하고 싶으신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 2), // 2 minutes ago
    user: {
      _id: 'my_user_id',
      name: '나',
      avatar: 'https://picsum.photos/id/238/200/300',
    },
  },
  {
    _id: '10',
    text: '다음 주 주말은 어떠신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 1), // 1 minute ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
  {
    _id: '11',
    text: '다음 주 주말은 어떠신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 1), // 1 minute ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
  {
    _id: '12',
    text: '다음 주 주말은 어떠신가요?',
    createdAt: new Date(Date.now() - 60 * 1000 * 1), // 1 minute ago
    user: {
      _id: 'other_user_id',
      name: '여행자',
      avatar: 'https://picsum.photos/id/237/200/300',
    },
  },
];

interface ChatViewProps {
  messages?: Message[]; // Make messages optional
  onSend: (text: string) => void;
  user?: { // Make user optional
    _id: string | number;
  };
}

const ChatView: React.FC<ChatViewProps> = ({
  messages: propMessages,
  onSend,
  user: propUser,
}) => {
  const [inputText, setInputText] = React.useState('');

  // Use provided user or a default for mock data
  const currentUser = propUser || { _id: 'my_user_id' };
  // Use provided messages or mock data if none provided
  const displayMessages = propMessages && propMessages.length > 0 ? propMessages : mockMessages;

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-gray-50'
      keyboardVerticalOffset={90} // Adjust this value as needed
    >
      <FlatList
        data={displayMessages}
        renderItem={({ item }) => (
          <MessageItem item={item} isMyMessage={item.user._id === currentUser._id} />
        )}
        keyExtractor={(item) => item._id.toString()}
        className='flex-1 px-4 pt-4'
        inverted
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <MessageInputBar
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatView;