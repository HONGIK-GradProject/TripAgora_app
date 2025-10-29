import SessionList from '@/components/common/SessionList';
import { SessionInfo } from '@/types/sessions';
import React from 'react';
import { FlatListProps } from 'react-native';

/**
 * @interface GuideSessionListProps
 * @extends Omit<FlatListProps<SessionInfo>, 'data' | 'renderItem' | 'keyExtractor' | 'userRole'>
 *
 * 가이드 전용 세션 리스트 컴포넌트의 props입니다.
 * 공용 `SessionList`의 props를 상속받지만, `userRole`은 내부적으로 'GUIDE'로 고정되므로 제외됩니다.
 */
interface GuideSessionListProps
  extends Omit<
    FlatListProps<SessionInfo>,
    'data' | 'renderItem' | 'keyExtractor' | 'userRole'
  > {
  /**
   * 리스트에 표시될 세션 데이터 배열입니다.
   */
  sessions: SessionInfo[];
}

/**
 * 가이드 전용 세션(여행) 리스트를 렌더링하는 컴포넌트입니다.
 *
 * 이 컴포넌트는 공용 `SessionList` 컴포넌트의 래퍼(wrapper) 역할을 하며,
 * `userRole` prop을 'GUIDE'로 고정하여 가이드에게 맞는 탐색 경로와 기능을 제공합니다.
 *
 * @param {GuideSessionListProps} props - 컴포넌트에 전달되는 props.
 * @returns {React.ReactElement} - `userRole`이 'GUIDE'로 설정된 `SessionList` 컴포넌트.
 */
const GuideSessionList: React.FC<GuideSessionListProps> = ({
  sessions,
  ...rest
}) => {
  return <SessionList sessions={sessions} userRole='GUIDE' {...rest} />;
};

export default GuideSessionList;
