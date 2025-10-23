import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const GuideTripDetailScreen: React.FC = () => {
  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row items-center justify-between px-5 pt-12 pb-2.5 border-b border-gray-200'>
        <TouchableOpacity className='mr-2.5'>
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text className='text-2xl font-bold'>홍대 1박2일 모임</Text>
        <TouchableOpacity className='ml-2.5'>
          <Ionicons name='notifications-outline' size={24} color='#8130FF' />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName='px-5 pb-24'>
        <View className='flex-row bg-gray-200 rounded-2xl p-4 mt-5 items-center'>
          <MaterialCommunityIcons
            name='calendar-clock'
            size={48}
            color='rgba(129, 48, 255, 0.59)'
          />
          <View className='ml-4 flex-1'>
            <Text className='text-lg font-semibold text-gray-900'>
              여행 진행중
            </Text>
            <Text className='text-sm text-gray-600'>
              2024년 3월 15일 - 3월 16일
            </Text>
          </View>
        </View>

        <View className='mt-6'>
          <Text className='text-xl font-bold mb-4'>참가자 목록</Text>
          <View className='space-y-3'>
            {[1, 2, 3, 4].map((index) => (
              <View
                key={index}
                className='flex-row items-center bg-gray-50 rounded-xl p-4'
              >
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    marginRight: 16,
                  }}
                  contentFit='cover'
                />
                <View className='flex-1'>
                  <Text className='text-base font-semibold text-gray-900'>
                    김여행
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    연락처: 010-1234-5678
                  </Text>
                </View>
                <TouchableOpacity className='bg-blue-100 px-3 py-1 rounded-full'>
                  <Text className='text-blue-800 text-sm font-medium'>
                    확인됨
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View className='mt-6'>
          <Text className='text-xl font-bold mb-4'>일정 관리</Text>
          <View className='bg-white border border-gray-200 rounded-xl p-4'>
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-base font-semibold'>Day 1 - 3월 15일</Text>
              <TouchableOpacity className='bg-purple-100 px-3 py-1 rounded-full'>
                <Text className='text-purple-800 text-sm font-medium'>
                  진행중
                </Text>
              </TouchableOpacity>
            </View>
            <View className='space-y-2'>
              <View className='flex-row items-center'>
                <View className='w-2 h-2 bg-purple-500 rounded-full mr-3'></View>
                <Text className='text-sm text-gray-700'>
                  10:00 - 홍대입구역 2번 출구
                </Text>
              </View>
              <View className='flex-row items-center'>
                <View className='w-2 h-2 bg-purple-500 rounded-full mr-3'></View>
                <Text className='text-sm text-gray-700'>12:00 - 맛집 투어</Text>
              </View>
              <View className='flex-row items-center'>
                <View className='w-2 h-2 bg-gray-300 rounded-full mr-3'></View>
                <Text className='text-sm text-gray-500'>15:00 - 카페 투어</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='mt-6'>
          <Text className='text-xl font-bold mb-4'>실시간 공지</Text>
          <View className='bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
            <View className='flex-row items-start'>
              <Ionicons name='information-circle' size={20} color='#F59E0B' />
              <View className='ml-2 flex-1'>
                <Text className='text-sm font-medium text-yellow-800'>
                  오늘 일정 변경 안내
                </Text>
                <Text className='text-sm text-yellow-700 mt-1'>
                  날씨가 좋아서 야외 활동을 추가했습니다. 편한 복장으로
                  와주세요!
                </Text>
                <Text className='text-xs text-yellow-600 mt-2'>2시간 전</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4'>
        <TouchableOpacity className='bg-purple-600 rounded-xl py-4'>
          <Text className='text-white text-center font-semibold text-lg'>
            일정 업데이트
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuideTripDetailScreen;
