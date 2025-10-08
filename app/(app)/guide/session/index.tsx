import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 여행 데이터 타입 정의
interface TripData {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  status: 'ongoing' | 'completed';
  imageUrl: string;
}

const GuideTripListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('ongoing');
  const router = useRouter();

  // 임시 데이터 (나중에 API에서 가져올 예정)
  const tripData: TripData[] = [
    {
      id: '1',
      title: '홍대 1박2일 모임',
      date: '2025.03.31 - 04.01',
      location: '홍대',
      participants: 4,
      status: 'ongoing',
      imageUrl: 'https://via.placeholder.com/90',
    },
    {
      id: '2',
      title: '후쿠오카 놀러가실분',
      date: '2025.05.16 - 05.21',
      location: '후쿠오카',
      participants: 4,
      status: 'ongoing',
      imageUrl: 'https://via.placeholder.com/90',
    },
    {
      id: '3',
      title: '제주도 힐링 여행',
      date: '2025.06.10 - 06.12',
      location: '제주도',
      participants: 6,
      status: 'completed',
      imageUrl: 'https://via.placeholder.com/90',
    },
    {
      id: '4',
      title: '부산 바다 여행',
      date: '2025.07.15 - 07.17',
      location: '부산',
      participants: 8,
      status: 'ongoing',
      imageUrl: 'https://via.placeholder.com/90',
    },
    {
      id: '5',
      title: '강릉 바다 여행',
      date: '2025.05.01 - 05.03',
      location: '강릉',
      participants: 5,
      status: 'completed',
      imageUrl: 'https://via.placeholder.com/90',
    },
  ];

  // 현재 탭에 따른 데이터 필터링
  const filteredTrips = tripData.filter((trip) => trip.status === activeTab);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* 헤더 */}
      <View className='bg-white pt-12 pb-4 px-6'>
        <Text className='text-3xl font-bold text-gray-900'>나의 여행 목록</Text>
      </View>

      {/* 현재 진행 중인 여행 섹션 */}
      <View className='px-6 py-4'>
        <Text className='text-xl font-semibold text-gray-800 mb-3'>
          현재 진행 중인 여행
        </Text>

        {tripData
          .filter((trip) => trip.status === 'ongoing')
          .slice(0, 1)
          .map((trip) => (
            <TouchableOpacity
              key={trip.id}
              className='bg-purple-500 rounded-2xl p-5'
              onPress={() =>
                router.push(`/guide/session/recruitmentDetail?id=${trip.id}`)
              }
            >
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: trip.imageUrl }}
                  className='w-20 h-20 rounded-xl mr-4'
                />
                <View className='flex-1'>
                  <View className='flex-row items-center mb-2'>
                    <View className='bg-white/20 px-3 py-1 rounded-full mr-2'>
                      <Text className='text-sm font-semibold text-white'>
                        Day 2
                      </Text>
                    </View>
                    <View className='bg-white/20 px-2 py-1 rounded-full'>
                      <Text className='text-xs text-white'>진행중</Text>
                    </View>
                  </View>
                  <Text className='text-xl font-bold text-white mb-1'>
                    {trip.title}
                  </Text>
                  <Text className='text-white/90 mb-2'>{trip.date}</Text>
                  <View className='flex-row items-center'>
                    <MaterialIcons
                      name='person-outline'
                      size={16}
                      color='white'
                    />
                    <Text className='text-white/90 ml-1 mr-4'>
                      {trip.participants}명
                    </Text>
                    <Ionicons name='location-outline' size={16} color='white' />
                    <Text className='text-white/90 ml-1'>{trip.location}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
              모집 중
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
      <ScrollView contentContainerClassName='px-6 py-4 pb-24'>
        <View className='space-y-4'>
          {filteredTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'
              onPress={() =>
                router.push(`/guide/session/recruitmentDetail?id=${trip.id}`)
              }
            >
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: trip.imageUrl }}
                  className='w-20 h-20 rounded-xl mr-4'
                />
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900 mb-1'>
                    {trip.title}
                  </Text>
                  <Text className='text-gray-600 mb-2'>{trip.date}</Text>
                  <View className='flex-row items-center'>
                    <MaterialIcons
                      name='person-outline'
                      size={16}
                      color='#6B7280'
                    />
                    <Text className='text-gray-600 ml-1 mr-4'>
                      {trip.participants}명
                    </Text>
                    <Ionicons
                      name='location-outline'
                      size={16}
                      color='#6B7280'
                    />
                    <Text className='text-gray-600 ml-1'>{trip.location}</Text>
                  </View>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    trip.status === 'ongoing' ? 'bg-gray-100' : 'bg-green-100'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      trip.status === 'ongoing'
                        ? 'text-gray-600'
                        : 'text-green-700'
                    }`}
                  >
                    {trip.status === 'ongoing' ? '모집중' : '완료'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredTrips.length === 0 && (
            <View className='flex-1 items-center justify-center py-20'>
              <Text className='text-gray-500 text-lg'>
                {activeTab === 'ongoing'
                  ? '모집 중인 여행이 없습니다.'
                  : '완료된 여행이 없습니다.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideTripListScreen;
