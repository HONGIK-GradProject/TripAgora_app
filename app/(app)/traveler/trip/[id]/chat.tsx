import ChatRoom from '@/components/common/ChatRoom';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const TravelerChatScreen: React.FC = () => {
  const { id, roomId } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  if (!roomId) {
    return (<></>);
  }

  else {
    return (
      <CustomSafeAreaView>
        <ChatRoom roomId={+roomId}/>
      </CustomSafeAreaView>
    );
  }
};

export default TravelerChatScreen;
