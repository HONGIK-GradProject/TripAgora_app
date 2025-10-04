import { TemplateDetailsProvider } from '@/contexts/TemplateDetailsProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

/**
 * 특정 템플릿 ID(`[id]`)에 해당하는 모든 상세 화면들을 그룹화하는 레이아웃입니다.
 * URL에서 추출한 `id`를 `TemplateDetailsProvider`에 전달하여
 * 하위 모든 화면들이 동일한 데이터 컨텍스트를 공유하도록 합니다.
 */
export default function ProductIdLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    // ID가 없는 경우를 대비한 로딩 또는 에러 처리
    return null;
  }

  return (
    <TemplateDetailsProvider id={id}>
      <Stack screenOptions={{ headerShown: false }} />
    </TemplateDetailsProvider>
  );
}
