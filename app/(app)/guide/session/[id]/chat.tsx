import ChatHeader from '@/components/common/ChatHeader';
import ChatRoom from '@/components/common/ChatRoom';
import CustomKeyboardAvoidingView from '@/components/CustomKeyboardAvoidingView';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ChatContent: React.FC<{ roomId: number }> = ({ roomId }) => {
  const { title } = useSessionDetails();

  return (
    <CustomKeyboardAvoidingView style={styles.container}>
      <ChatHeader title={title || '채팅방'} />
      <View style={styles.chatContainer}>
        <ChatRoom roomId={roomId} />
      </View>
    </CustomKeyboardAvoidingView>
  );
};

const GuideChatScreen: React.FC = () => {
  const { id, roomId } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  if (!roomId || !id) {
    return <></>;
  }

  return (
    <CustomSafeAreaView>
      <SessionDetailsProvider id={id}>
        <ChatContent roomId={+roomId} />
      </SessionDetailsProvider>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
});

export default GuideChatScreen;
