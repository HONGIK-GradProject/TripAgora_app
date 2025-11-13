import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// symbols
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GuideTabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();

  const segment = useSegments();
  const page = segment[segment.length - 1];
  const pagesToHide = [
    'edit-itinerary',
    'edit-itineraries',
    'edit-regions',
    'edit-tags',
  ];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        tabBarInactiveTintColor: Colors['light'].tabIconDefault,
        headerShown: false,
        tabBarButton: undefined,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            borderTopWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          default: {
            height: 70 + bottom,
            paddingTop: 5,
            display: pagesToHide.includes(page) ? 'none' : 'flex',
            backgroundColor: Colors['light'].background,
            borderTopWidth: 0,
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: '홈',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name='home' size={26} color={color} />
            ) : (
              <Ionicons name='home-outline' size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='template'
        options={{
          title: '여행 계획',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <AntDesign name='product' size={26} color={color} />
            ) : (
              <AntDesign name='product' size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='session'
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
                className='-top-7 justify-center items-center'
              >
                <View className='w-20 h-20 rounded-full bg-[#a9c0ffa3] justify-center items-center shadow-lg'>
                  <View className='w-16 h-16 rounded-full bg-[#6C4CE9] justify-center items-center shadow-lg'>
                    {props.children}
                  </View>
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
          title: '가이드',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <FontAwesome name='id-card' size={26} color={color} />
            ) : (
              <FontAwesome name='id-card-o' size={26} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: '마이',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='person' size={26} color={color} />
            ) : (
              <MaterialIcons name='person-outline' size={26} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default GuideTabLayout;
