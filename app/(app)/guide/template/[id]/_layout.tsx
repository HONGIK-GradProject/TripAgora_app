import { TemplateDetailsProvider } from '@/contexts/TemplateDetailsProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

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
