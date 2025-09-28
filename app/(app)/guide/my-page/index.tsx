import { authApi } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const GuideMyPageScreen: React.FC = () => {
  const { switchUserRole } = useAuth();

  const handleSwitchUserRole = async () => {
    await switchUserRole('traveler');
  };

  const handleSignOut = async () => {
    await authApi.signOut();
    router.replace('/login');
  };

  return (
    <View className='flex-1 bg-white'>
      <View className='items-center px-5 pt-12 pb-5 border-b border-gray-200'>
        <View className='items-center mb-2.5'>
          <View className='w-24 h-24 rounded-full bg-gray-300 justify-center items-center'>
            <Ionicons name='person-circle-outline' size={96} color='#999' />
          </View>
          <Text className='text-4xl font-bold mt-2.5'>김 홍익</Text>
        </View>
        <Text className='text-2xl text-gray-500 mb-2.5'>
          여행 0건, 가이드 0건
        </Text>
        <TouchableOpacity
          className='bg-white/50 border border-black rounded-md py-2.5 px-5'
          onPress={handleSwitchUserRole}
        >
          <Text className='text-xl text-black'>
            {'여행자 <-> 가이드 전환하기'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName='px-5 py-5 pb-24'>
        <View>
          <TouchableOpacity className='border-b border-gray-400 py-4'>
            <Text className='text-2xl text-black'>나의 관심사 설정</Text>
          </TouchableOpacity>
          <TouchableOpacity className='border-b border-gray-400 py-4'>
            <Text className='text-2xl text-black'>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='border-b border-gray-400 py-4'
            onPress={handleSignOut}
          >
            <Text className='text-2xl text-black'>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity className='border-b border-gray-400 py-4'>
            <Text className='text-2xl text-black'>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideMyPageScreen;
