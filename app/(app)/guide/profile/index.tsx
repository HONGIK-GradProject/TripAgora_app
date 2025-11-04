import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const GuideProfileScreen: React.FC = () => {
  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-white'>
        <View className='flex-row items-center justify-between px-5 pt-6 pb-2.5 border-b border-gray-200'>
          <View className='flex-row items-center'>
            <View className='w-12 h-12 rounded-full bg-gray-300 justify-center items-center'>
              <Ionicons name='person-circle-outline' size={48} color='#999' />
            </View>
            <Text className='text-2xl font-bold ml-2.5'>김 홍익</Text>
          </View>
          <TouchableOpacity className='bg-white/50 border border-black rounded-md py-1 px-2.5'>
            <Text className='text-xl text-black'>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerClassName='px-5 pb-24'>
          <View className='flex-row items-center justify-center my-5'>
            <View className='flex-row mr-2.5'>
              <Ionicons name='star' size={24} color='#8130FF' />
              <Ionicons name='star' size={24} color='#8130FF' />
              <Ionicons name='star' size={24} color='#8130FF' />
              <Ionicons name='star' size={24} color='#8130FF' />
              <Ionicons name='star-half' size={24} color='#8130FF' />
            </View>
            <Text className='text-2xl font-bold'>평균 별점 4.5</Text>
          </View>

          <View className='mb-7'>
            <Text className='text-2xl font-bold mb-2.5'>가이드 소개</Text>
            <Text className='text-xl text-gray-500'>
              함께 즐거운 여행해요! #후쿠오카 #홍대 #음식 #액티비티
            </Text>
          </View>

          <View className='mb-7'>
            <Text className='text-2xl font-bold mb-2.5'>
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

          <View className='mb-7'>
            <Text className='text-2xl font-bold mb-2.5'>리뷰</Text>
            <View className='bg-white border border-gray-400 rounded-3xl p-4 mb-4'>
              <View className='flex-row items-center mb-2.5'>
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }}
                  className='w-10 h-10 rounded-full mr-2.5 bg-gray-300'
                />
                <Text className='text-xl text-black'>
                  홍 길동, 후쿠오카 놀러가실분
                </Text>
              </View>
              <Text className='text-xl text-black mb-1'>★★★★☆ 리뷰 텍스트 2</Text>
              <Text className='text-xl text-black underline'>리뷰 더보기...</Text>
            </View>
            <View className='bg-white border border-gray-400 rounded-3xl p-4 mb-4'>
              <View className='flex-row items-center mb-2.5'>
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }}
                  className='w-10 h-10 rounded-full mr-2.5 bg-gray-300'
                />
                <Text className='text-xl text-black'>
                  박 대기, 홍대 1박2일 모임
                </Text>
              </View>
              <Text className='text-xl text-black mb-1'>★★★★☆ 리뷰 텍스트 1</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
};

export default GuideProfileScreen;
