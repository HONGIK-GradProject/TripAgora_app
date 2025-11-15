import ChatRoom from '@/components/common/ChatRoom';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

const TravelerHomeScreen: React.FC = () => {
  const { user } = useAuth();
  return (
    <ChatRoom roomId={1}/>
  );
};

export default TravelerHomeScreen;
