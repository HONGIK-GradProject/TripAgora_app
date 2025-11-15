import React from 'react';
import {
  FlatList,
  View
} from 'react-native';
import { ChatMessage } from '../../types/chat';
import MessageInputBar from './MessageInputBar';
import MessageItem from './MessageItem';

interface ChatViewProps {
  messages?: ChatMessage[];
  onSend: (text: string) => void;
  user?: {
    _id: string | number;
  };
  onLoadEarlier?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages: propMessages,
  onSend,
  user: propUser,
  onLoadEarlier,
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
    <View style={{flex: 1}}>
      <FlatList
        data={displayMessages}
        renderItem={({ item }) => (
          <MessageItem item={item} isMyMessage={item.senderId === currentUser._id} />
        )}
        keyExtractor={(item) => item.sentAt}
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