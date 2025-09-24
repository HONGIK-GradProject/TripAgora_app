import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MyProductsScreen: React.FC = () => {
  return (
    <View className='flex-1 bg-white pt-12'>
      <View className='flex-row items-center mx-5 mb-5 border-b border-gray-400 pb-2.5'>
        <TextInput
          className='flex-1 text-xl text-gray-400'
          placeholder='내 여행 모집 검색하기'
        />
        <Ionicons name='search' size={24} color='#999' className='ml-2.5' />
        <TouchableOpacity className='ml-2.5'>
          <Ionicons name='add-circle' size={60} color='#613EEA' />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName='px-5 pb-24'>
        <Text className='text-4xl font-bold mb-5'>모집 중인 내 상품</Text>
        <View>
          {/* 모집 중인 상품 리스트 (임시) */}
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '1' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>홍대 1박2일 모임</Text>
              <Text className='text-xl text-black'>2025.03.31 - 04.01</Text>
              <Text className='text-xl text-black'>4명 홍대</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '2' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>
                후쿠오카 놀러가실분
              </Text>
              <Text className='text-xl text-black'>2025.05.16 - 05.21</Text>
              <Text className='text-xl text-black'>2/4명 일본, 후쿠오카</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '3' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>모히또 관광</Text>
              <Text className='text-xl text-black'>2025.07.28 - 08.01</Text>
              <Text className='text-xl text-black'>4/6명 몰디브</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '4' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>여수 식도락 여행</Text>
              <Text className='text-xl text-black'>2025.08.01 - 08.03</Text>
              <Text className='text-xl text-black'>3/4명 전남 여수</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '5' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>ㅇㅋ 미정</Text>
              <Text className='text-xl text-black'>미정</Text>
              <Text className='text-xl text-black'>1/3명 일본, 오키나와</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-400 rounded-3xl p-4 mb-4 items-center'
            onPress={() =>
              router.push({
                pathname: '/ProductDetailScreen',
                params: { id: '6' },
              })
            }
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/90' }}
              className='w-24 h-24 rounded-xl mr-4'
            />
            <View className='flex-1'>
              <Text className='text-2xl font-bold mb-1'>경주 2박3일</Text>
              <Text className='text-xl text-black'>2025.04.01 - 04.04</Text>
              <Text className='text-xl text-black'>2/3명 경북 경주</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyProductsScreen;
