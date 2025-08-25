import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// symbols
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: '홈',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name='home' size={28} color={color} />
            ) : (
              <Ionicons name='home-outline' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: '검색',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name='search' size={28} color={color} />
            ) : (
              <Ionicons name='search-outline' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='travel'
        options={{
          title: '여행',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='flight' size={28} color={color} />
            ) : (
              <MaterialIcons name='flight-takeoff' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='wishlist'
        options={{
          title: '찜',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='favorite' size={28} color={color} />
            ) : (
              <MaterialIcons name='favorite-border' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: '프로필',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='person' size={28} color={color} />
            ) : (
              <MaterialIcons name='person-outline' size={28} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
