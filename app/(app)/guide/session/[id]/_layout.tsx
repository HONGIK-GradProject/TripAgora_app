import { Stack } from 'expo-router';
import React from 'react';

export default function SessionLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='GuideTripDetailScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen name='edit-recruitment' options={{ headerShown: false }} />
      <Stack.Screen name='session-room' options={{ headerShown: false }} />
      <Stack.Screen name='announce' options={{ headerShown: false }} />
    </Stack>
  );
}

// SessionDetailsProvider는 각 개별 페이지에서 필요에 따라 감싸도록 수정
