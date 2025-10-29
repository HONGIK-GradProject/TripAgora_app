import SessionList from '@/components/common/SessionList';
import { SessionInfo } from '@/types/sessions';
import React from 'react';
import { FlatListProps } from 'react-native';

interface GuideSessionListProps
  extends Omit<
    FlatListProps<SessionInfo>,
    'data' | 'renderItem' | 'keyExtractor' | 'userRole'
  > {
  sessions: SessionInfo[];
}

const GuideSessionList: React.FC<GuideSessionListProps> = ({
  sessions,
  ...rest
}) => {
  return (
    <SessionList
      sessions={sessions}
      userRole='GUIDE'
      {...rest}
    />
  )
};

export default GuideSessionList;
