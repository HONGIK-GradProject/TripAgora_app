import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import GuideProfileScreen from '@/components/guide/GuideProfileScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

/**
 * 가이드 프로필 화면입니다. (프로필 탭)
 * 자신의 가이드 프로필을 확인하고 수정할 수 있습니다.
 */
const GuideProfileIndexScreen: React.FC = () => {
  const params = useLocalSearchParams<{ guideId?: string }>();
  const guideProfileId = params.guideId ? parseInt(params.guideId) : undefined;

  return (
    <CustomSafeAreaView>
      <GuideProfileScreen guideProfileId={guideProfileId} />
    </CustomSafeAreaView>
  );
};

export default GuideProfileIndexScreen;
