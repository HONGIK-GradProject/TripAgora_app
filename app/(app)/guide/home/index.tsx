import ChatView from '@/components/chat/ChatView';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const GuideHomeScreen: React.FC = () => {
  const { user } = useAuth();
  return (
    <View className='flex-1 bg-gray-50'>
      {/* 헤더 */}
      <View className='bg-white pt-12 pb-4 px-6'>
        <TouchableOpacity
          className='flex-row items-center'
          onPress={() => router.push('/guide/my-page')}
          activeOpacity={0.7}
        >
          <View className='w-10 h-10 rounded-full bg-gray-200 justify-center items-center'>
            {user?.profileImageUrl ? (
              <Image
                source={{ uri: user.profileImageUrl }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit='cover'
              />
            ) : (
              <Ionicons
                name='person-circle-outline'
                size={36}
                color='#6B7280'
              />
            )}
          </View>
          <Text className='text-xl font-bold ml-3 text-gray-900'>
            {user?.nickname || '닉네임 없음'}
          </Text>
        </TouchableOpacity>
      </View>

      <ChatView messages={[]} onSend={function (text: string): void {
        throw new Error('Function not implemented.');
      } } user={{
        _id: 'my_user_id'
      }}/>
    </View>
  );
};

export default GuideHomeScreen;
