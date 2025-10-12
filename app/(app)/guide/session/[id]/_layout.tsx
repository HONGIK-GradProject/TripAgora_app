import { Stack } from 'expo-router';
import React from 'react';

export default function SessionDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
          title: '세션 상세',
        }}
      />
      <Stack.Screen
        name='edit-recruitment'
        options={{
          headerShown: false,
          title: '모집 정보 수정',
        }}
      />
      <Stack.Screen
        name='GuideTripDetailScreen'
        options={{
          headerShown: false,
          title: '여행 상세',
        }}
      />
    </Stack>
  );
}
