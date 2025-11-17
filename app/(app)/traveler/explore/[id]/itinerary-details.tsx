import { SessionItineraryDetailsContent } from '@/components/session/SessionItineraryDetailsScreen';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

/**
 * 일정 상세보기 화면입니다. (여행자 explore 세션 상세에서 진입)
 */
const TravelerExploreItineraryDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <SessionDetailsProvider id={id}>
      <SessionItineraryDetailsContent />
    </SessionDetailsProvider>
  );
};

export default TravelerExploreItineraryDetailsScreen;
