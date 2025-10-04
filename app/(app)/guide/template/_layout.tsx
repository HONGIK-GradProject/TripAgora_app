import { Stack } from 'expo-router';
import React from 'react';

/**
 * 가이드의 템플릿 관련 화면들을 그룹화하는 최상위 레이아웃입니다.
 * 이 레이아웃에 속한 모든 화면에 공통적으로 헤더를 숨기는 옵션을 적용합니다.
 */
export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }}/>;
}
