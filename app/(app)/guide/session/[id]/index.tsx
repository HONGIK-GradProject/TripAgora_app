import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import SessionDetailScreen from '@/components/session/SessionDetailScreen';
import React from 'react';

/**
 * 가이드용 세션 상세 정보를 보여주는 화면입니다.
 * 제목, 소개, 지역, 태그, 일정 등을 확인하고 모집 취소/확정 기능을 제공합니다.
 */
const GuideSessionDetailScreen: React.FC = () => {
  return (
    <CustomSafeAreaView>
      <SessionDetailScreen userType='guide' />
    </CustomSafeAreaView>
  );
};

export default GuideSessionDetailScreen;
