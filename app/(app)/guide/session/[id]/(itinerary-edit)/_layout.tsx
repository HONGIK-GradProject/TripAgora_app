import { SessionItineraryEditorProvider } from '@/contexts/SessionItineraryEditorProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SessionItineraryEditLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <SessionItineraryEditorProvider sessionId={id}>
      <Stack screenOptions={{ headerShown: false }} />
    </SessionItineraryEditorProvider>
  );
}

