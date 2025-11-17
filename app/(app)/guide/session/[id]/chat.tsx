import ChatRoom from '@/components/common/ChatRoom';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

const TravelerChatScreen: React.FC = () => {
  const { id, roomId } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  if (!roomId) {
    router.back();
  }

  else {
    return (
      <CustomSafeAreaView edges={['top', 'right', 'left']}>
        <ChatRoom roomId={+roomId}/>
      </CustomSafeAreaView>
    );
  }
};

export default TravelerChatScreen;
