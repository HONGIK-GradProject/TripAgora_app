import { Tabs, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// symbols
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TravelerTabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const segments = useSegments();
  const page = segments[segments.length - 1];
  const pagesToHide = ['edit-tags'];

  // 현재 활성화된 탭이 해당 탭인지 확인하는 함수
  // segments 구조: ['(app)', 'traveler', 'home'] 또는 ['(app)', 'traveler', 'explore', '123']
  const isTabActive = (tabName: string) => {
    // segments[2]가 탭 이름과 일치하는지 확인
    return segments[2] === tabName;
  };

  // 현재 경로가 해당 탭의 index인지 확인하는 함수
  // segments.length === 3이면 index에 있음 (예: ['(app)', 'traveler', 'home'])
  const isTabIndex = (tabName: string) => {
    return segments[2] === tabName && segments.length === 3;
  };

  // 탭을 눌렀을 때 스택을 초기화하는 핸들러
  const handleTabPress = (tabName: string, e: any) => {
    // 이미 활성화된 탭을 다시 누른 경우
    if (isTabActive(tabName)) {
      // 이미 index에 있으면 아무것도 하지 않음
      if (isTabIndex(tabName)) {
        e.preventDefault();
        return;
      }
      // 하위 경로에 있으면 스택을 초기화하고 루트로 이동
      e.preventDefault();
      router.replace(`/traveler/${tabName}` as any);
    }
  };
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
        listeners={{
          tabPress: (e) => handleTabPress('home', e),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: '검색',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name='search' size={26} color={color} />
            ) : (
              <Ionicons name='search-outline' size={26} color={color} />
            ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress('explore', e),
        }}
      />
      <Tabs.Screen
        name='trip'
        options={{
          title: '여행',
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name={focused ? 'flight' : 'flight-takeoff'}
              size={26}
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
                <View className='w-20 h-20 rounded-full bg-[#5B67F533] justify-center items-center shadow-lg'>
                  <View className='w-16 h-16 rounded-full bg-[#5B67F5] justify-center items-center shadow-lg'>
                    {props.children}
                  </View>
                </View>
              </Pressable>
            );
          },
          tabBarLabel: () => null, // 중앙 버튼은 라벨 숨김
        }}
        listeners={{
          tabPress: (e) => handleTabPress('trip', e),
        }}
      />
      <Tabs.Screen
        name='wishlist'
        options={{
          title: '찜',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='favorite' size={26} color={color} />
            ) : (
              <MaterialIcons name='favorite-border' size={26} color={color} />
            ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress('wishlist', e),
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: '프로필',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MaterialIcons name='person' size={26} color={color} />
            ) : (
              <MaterialIcons name='person-outline' size={26} color={color} />
            ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress('my-page', e),
        }}
      />
    </Tabs>
  );
};

export default TravelerTabLayout;
