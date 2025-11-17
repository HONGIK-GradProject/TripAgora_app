import { Stack } from 'expo-router';
import React from 'react';

export default function TravelerSessionLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='itinerary-details' options={{ headerShown: false }} />
      <Stack.Screen name='view-location' options={{ headerShown: false }} />
      <Stack.Screen name='chat' options={{ headerShown: false }} />
      {/* <Stack.Screen name='reviews' options={{ headerShown: false }} /> */}
      <Stack.Screen
        name='[guideId]'
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
