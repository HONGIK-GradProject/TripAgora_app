import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const GuideHomeScreen: React.FC = () => {
  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row justify-between items-center px-5 pt-12 pb-2.5'>
        <View className='flex-row items-center'>
          <View className='w-12 h-12 rounded-full bg-gray-300 justify-center items-center'>
            <Ionicons name='person-circle-outline' size={48} color='#999' />
          </View>
          <Text className='text-2xl font-bold ml-2.5'>김 홍익</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName='px-5 pb-24'>
        <View className='flex-row bg-gray-300 rounded-3xl p-5 mt-5 items-center'>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            className='w-20 h-20 rounded-full mr-4'
          />
          <View className='flex-1'>
            <Text className='text-2xl font-bold mb-1'>
              가이드님, 반갑습니다!
            </Text>
            <Text className='text-xl text-black'>
              일정과 모집글을 작성해 여행객을 모집해 보세요!
            </Text>
          </View>
        </View>

        <View className='mt-7'>
          <Text className='text-2xl font-bold mb-4'>
            김 홍익 가이드님의 여행 상품
          </Text>
          <View className='flex-row flex-wrap justify-between'>
            {/* 가이드 상품 리스트 (임시) */}
            <View className='w-[48%] mb-4 rounded-2xl overflow-hidden bg-gray-200 h-36 justify-center items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
            </View>
            <View className='w-[48%] mb-4 rounded-2xl overflow-hidden bg-gray-200 h-36 justify-center items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
            </View>
            <View className='w-[48%] mb-4 rounded-2xl overflow-hidden bg-gray-200 h-36 justify-center items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
            </View>
            <View className='w-[48%] mb-4 rounded-2xl overflow-hidden bg-gray-200 h-36 justify-center items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
            </View>
            <View className='w-[48%] mb-4 rounded-2xl overflow-hidden bg-gray-200 h-36 justify-center items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
            </View>
            <TouchableOpacity className='w-full bg-gray-300 rounded-2xl py-2.5 items-center mt-2.5'>
              <Text className='text-2xl font-bold text-black'>더보기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className='mt-7'>
          <Text className='text-2xl font-bold mb-4'>이달의 가이드 순위</Text>
          <View className='bg-white border border-gray-400 rounded-3xl p-4 mb-2.5'>
            <Text className='text-2xl text-black'>
              투어리즘(김영진) 평점 4.95
            </Text>
          </View>
          <View className='bg-white border border-gray-400 rounded-3xl p-4 mb-2.5'>
            <Text className='text-2xl text-black'>
              낫쏘리(안미안) 평점 4.93
            </Text>
          </View>
          <View className='bg-white border border-gray-400 rounded-3xl p-4 mb-2.5'>
            <Text className='text-2xl text-black'>전문가(전문가) 평점 4.9</Text>
          </View>
          <TouchableOpacity className='w-full bg-gray-300 rounded-2xl py-2.5 items-center mt-2.5'>
            <Text className='text-2xl font-bold text-black'>더보기...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideHomeScreen;
