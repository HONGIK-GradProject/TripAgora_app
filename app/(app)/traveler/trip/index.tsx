import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const TravelerTripListScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('ongoing');

  return (
    <View className='flex-1 bg-gray-50'>
      {/* 헤더 */}
      <View className='bg-white pt-12 pb-4 px-6'>
        <Text className='text-3xl font-bold text-gray-900'>나의 여행 목록</Text>
      </View>

      {/* 탭 메뉴 */}
      <View className='bg-white px-6 py-2 border-b border-gray-200'>
        <View className='flex-row bg-gray-100 rounded-xl p-1'>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'ongoing' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'ongoing' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              예정 / 진행 중
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'completed' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'completed' ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              완료
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 여행 목록 */}
      <View className='flex-1 px-6 py-4'>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 예정 / 진행 중인 여행 리스트 */}
          <TouchableOpacity
            className='bg-white rounded-2xl mb-2 p-5 shadow-sm border border-gray-100'
            onPress={() => router.push('/ReviewWriteScreen')}
            activeOpacity={0.7}
          >
            <View className='flex-row items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  marginRight: 16,
                }}
                resizeMode='cover'
              />
              <View className='flex-1'>
                <Text className='text-lg font-semibold text-gray-900 mb-1'>
                  홍대 1박2일 모임
                </Text>
                <Text className='text-gray-600 mb-2'>
                  2025.03.31 ~ 2025.04.01
                </Text>
                <View className='flex-row items-start'>
                  <MaterialIcons
                    name='person-outline'
                    size={16}
                    color='#6B7280'
                    style={{ marginTop: 2 }}
                  />
                  <Text className='text-gray-600 ml-1 mr-4'>4/6명</Text>
                  <Ionicons
                    name='location-outline'
                    size={16}
                    color='#6B7280'
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    className='text-gray-600 ml-1 flex-1'
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    홍대
                  </Text>
                </View>
              </View>
              <View className='px-3 py-1 rounded-full bg-green-100'>
                <Text className='text-sm text-green-700'>완료</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className='bg-white rounded-2xl mb-2 p-5 shadow-sm border border-gray-100'
            activeOpacity={0.7}
          >
            <View className='flex-row items-center'>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  marginRight: 16,
                }}
                resizeMode='cover'
              />
              <View className='flex-1'>
                <Text className='text-lg font-semibold text-gray-900 mb-1'>
                  후쿠오카 놀러가실분
                </Text>
                <Text className='text-gray-600 mb-2'>
                  2025.05.16 ~ 2025.05.21
                </Text>
                <View className='flex-row items-start'>
                  <MaterialIcons
                    name='person-outline'
                    size={16}
                    color='#6B7280'
                    style={{ marginTop: 2 }}
                  />
                  <Text className='text-gray-600 ml-1 mr-4'>4/6명</Text>
                  <Ionicons
                    name='location-outline'
                    size={16}
                    color='#6B7280'
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    className='text-gray-600 ml-1 flex-1'
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    후쿠오카
                  </Text>
                </View>
              </View>
              <View className='px-3 py-1 rounded-full bg-green-100'>
                <Text className='text-sm text-green-700'>승인</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default TravelerTripListScreen;
