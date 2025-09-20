import { useAuth } from '@/hooks/useAuth';
import { Redirect, Slot, useSegments } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  const { accessToken, isLoading, userRole } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return null; // Or a loading indicator
  }

  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  // segments[0] is '(app)'
  const inAppLayout = segments[0] === '(app)';

  // (app) 그룹 내에 있을 경우, 역할에 따른 리디렉션 로직을 수행합니다.
  if (inAppLayout) {
    // 사용자가 가이드이지만 현재 경로가 /guide/로 시작하지 않으면 가이드 홈으로 리디렉션합니다.
    if (userRole === 'guide' && segments[1] !== 'guide') {
      return <Redirect href="/guide/home" />;
    }
    // 사용자가 여행자이지만 현재 경로가 /traveler/로 시작하지 않으면 여행자 홈으로 리디렉션합니다.
    if (userRole === 'traveler' && segments[1] !== 'traveler') {
      return <Redirect href="/traveler/home" />;
    }
  }

  // 위의 모든 리디렉션 조건에 해당하지 않으면, 현재 요청된 경로의 자식 컴포넌트를 렌더링합니다.
  return <Slot />;
}