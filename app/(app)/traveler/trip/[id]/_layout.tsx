import { Stack } from 'expo-router';
import React from 'react';

export default function TravelerTripLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='session-room' options={{ headerShown: false }} />
      <Stack.Screen name='itinerary-details' options={{ headerShown: false }} />
      <Stack.Screen name='notice' options={{ headerShown: false }} />
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
