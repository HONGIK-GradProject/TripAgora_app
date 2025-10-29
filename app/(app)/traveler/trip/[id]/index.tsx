import SessionDetailScreen from '@/components/session/SessionDetailScreen';
import React from 'react';

/**
 * 여행자용 세션 상세 정보를 보여주는 화면입니다.
 * 제목, 소개, 지역, 태그, 일정 등을 확인하고 참여 신청 기능을 제공합니다.
 */
const TravelerSessionDetailScreen: React.FC = () => {
  return <SessionDetailScreen userType='traveler' />;
};

export default TravelerSessionDetailScreen;
