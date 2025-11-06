import GuideProfileScreen from '@/components/guide/GuideProfileScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

/**
 * 가이드 프로필 화면입니다. (여행자 explore 세션 상세에서 진입)
 * 세션 상세 페이지에서 가이드 정보를 터치하면 페이지로 이동합니다.
 */
const TravelerExploreGuideProfileScreen: React.FC = () => {
  const { guideId } = useLocalSearchParams<{ guideId: string }>();
  const guideProfileId = guideId ? parseInt(guideId) : undefined;

  return (
    <GuideProfileScreen guideProfileId={guideProfileId} showBackButton={true} />
  );
};

export default TravelerExploreGuideProfileScreen;
