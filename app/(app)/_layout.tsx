import { useAuth } from '@/hooks/useAuth';
import { Redirect, Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

export default function AppLayout() {
  const { accessToken, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 로딩 중이거나, 아직 user 정보가 없으면 아무것도 하지 않음
    if (isLoading || !user) return;

    // 로그아웃 상태이면 로그인 화면으로 리디렉션
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    const inAppLayout = segments[0] === '(app)';

    if (inAppLayout) {
      // 사용자가 가이드이지만 현재 경로가 /guide/로 시작하지 않으면 가이드 홈으로 리디렉션
      if (user.role === 'GUIDE' && segments[1] !== 'guide') {
        router.replace('/guide/home');
      }
      // 사용자가 여행자이지만 현재 경로가 /traveler/로 시작하지 않으면 여행자 홈으로 리디렉션
      if (user.role === 'TRAVELER' && segments[1] !== 'traveler') {
        router.replace('/traveler/home');
      }
    }
  }, [isLoading, user, accessToken, segments, router]);

  if (isLoading) {
    return null; // Or a loading indicator
  }

  // accessToken이 초기에 없을 때만 Redirect를 사용하고, 나머지는 useEffect에서 처리
  if (!accessToken && !isLoading) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}