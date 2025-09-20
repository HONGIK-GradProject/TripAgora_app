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

const GuideTabLayout: React.FC = () => {
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
        name='home'
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
        name='product'
        options={{
          title: '내 상품',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name='search' size={28} color={color} />
            ) : (
              <Ionicons name='search-outline' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='trip'
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
                className="-top-5 justify-center items-center"
              >
                <View
                  className="w-16 h-16 rounded-full bg-[#6C4CE9] justify-center items-center shadow-lg"
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
        name='profile'
        options={{
          title: '프로필',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='favorite' size={28} color={color} />
            ) : (
              <MaterialIcons name='favorite-border' size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: '마이',
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

export default GuideTabLayout;