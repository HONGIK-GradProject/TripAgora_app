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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyProductsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className='flex-1 bg-white pt-12 relative'>
      <View className='flex-row items-center mx-5 mb-5 rounded-full bg-gray-100 px-4 py-3'>
        <Ionicons name='search' size={20} color='#999' />
        <TextInput
          className='flex-1 text-base text-gray-700 ml-2'
          placeholder='내 여행 모집 검색하기'
          placeholderTextColor={'#9CA3AF'}
        />
      </View>

      <ScrollView contentContainerClassName='px-5 pb-24'>
        <Text className='text-3xl font-bold mb-5'>내 상품 템플릿</Text>
        <View>
          {/* 템플릿 리스트 (임시) */}
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>홍대</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>일본, 후쿠오카</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>몰디브</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>전남 여수</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>일본, 오키나와</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
            onPress={() =>
              router.push({
                pathname: '/TemplateDetailScreen',
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
              <Text className='text-lg text-gray-600'>경북 경주</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Floating action button - bottom right above bottom navbar */}
      <TouchableOpacity
        className='absolute right-5 w-16 h-16 rounded-full bg-[#613EEA] items-center justify-center'
        style={{ elevation: 8, bottom: insets.bottom + 20 }}
        onPress={() =>
          router.push({
            pathname: '/TemplateDetailScreen',
            params: { id: '0' },
          })
        }
      >
        <Ionicons name='add' size={32} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

export default MyProductsScreen;
