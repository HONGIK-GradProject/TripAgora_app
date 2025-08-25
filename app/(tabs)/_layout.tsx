import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

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
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name={focused ? 'flight' : 'flight-takeoff'}
              size={28}
              color={'#fff'}
            />
          ),
          tabBarButton: (props) => {
            // Filter out any props with value null (e.g., disabled: null)
            const filteredProps = Object.fromEntries(
              Object.entries(props).filter(([_, v]) => v !== null)
            );

            return (
              <Pressable
                {...filteredProps}
                android_ripple={{ borderless: false, color: 'transparent' }}
                style={{
                  top: -20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: '#6C4CE9',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  {props.children}
                </View>
              </Pressable>
            );
          },
          tabBarLabel: () => null, // 중앙 버튼은 라벨 숨김
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
