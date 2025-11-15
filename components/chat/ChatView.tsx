import React from 'react';
import {
  FlatList
} from 'react-native';
import { ChatMessage } from '../../types/chat';
import CustomKeyboardAvoidingView from '../CustomKeyboardAvoidingView';
import MessageInputBar from './MessageInputBar';
import MessageItem from './MessageItem';

interface ChatViewProps {
  messages?: ChatMessage[]; // Make messages optional
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
  
  const currentUser = propUser || { _id: 'my_user_id' };
  const displayMessages = propMessages && propMessages.length > 0 ? propMessages : [];

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  return (
    <CustomKeyboardAvoidingView>
      <FlatList
        data={displayMessages}
        renderItem={({ item }) => (
          <MessageItem item={item} isMyMessage={item.senderId === currentUser._id} />
        )}
        keyExtractor={(item) => item.sentAt}
        className='flex-1 px-4 pt-4'
        inverted
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <MessageInputBar
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
      />
    </CustomKeyboardAvoidingView>
  );
};

export default ChatView;