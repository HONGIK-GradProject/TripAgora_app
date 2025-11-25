import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useAuth } from '@/hooks/useAuth';
import { searchSessions } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TravelerHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [recommendedSessions, setRecommendedSessions] = useState<
    SessionInfo[]
  >([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);

  // 날짜를 표시용 형식으로 변환 (예: 2024.01.15)
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 사용자의 관심사 기반으로 맞춤 여행 조회
  useEffect(() => {
    const fetchRecommendedSessions = async () => {
      if (!user?.tagIds || user.tagIds.length === 0) {
        return;
      }

      setIsLoadingRecommended(true);
      try {
        const response = await searchSessions(
          undefined, // keyword
          undefined, // searchStartDate
          undefined, // searchEndDate
          undefined, // regionIds
          user.tagIds, // tagIds - 사용자의 관심사 태그
          0, // page
          4 // size - 최대 4개까지
        );

        if (response && response.sessions) {
          // 최대 4개까지만 표시
          setRecommendedSessions(response.sessions.slice(0, 4));
        }
      } catch (error) {
        console.error('맞춤 여행 조회 에러:', error);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedSessions();
  }, [user?.tagIds]);

  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-gray-50'>
        {/* 헤더 */}
        <View className='bg-white pt-6 pb-4 px-6'>
          <TouchableOpacity
            className='flex-row items-center'
            onPress={() => router.push('/traveler/my-page')}
            activeOpacity={0.7}
          >
            <View className='w-10 h-10 rounded-full bg-gray-200 justify-center items-center'>
              {user?.profileImageUrl ? (
                <RNImage
                  source={{ uri: user.profileImageUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
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

        <ScrollView contentContainerClassName='pb-24'>
          {/* 환영 배너 */}
          <View className='mx-6 mt-6'>
            <View className='bg-white rounded-2xl p-6 border border-gray-200'>
              <View className='flex-row items-center'>
                <View className='bg-blue-100 w-14 h-14 rounded-full items-center justify-center mr-4'>
                  <Ionicons name='airplane-outline' size={28} color='#3B82F6' />
                </View>
                <View className='flex-1'>
                  <Text className='text-2xl font-bold text-gray-900 mb-1'>
                    여행을 떠나보아요!
                  </Text>
                  <Text className='text-gray-600 text-base'>
                    태그와 일정을 통해 나에게 딱 맞는 여행을 찾아보세요
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 추천 여행 상품 섹션 */}
          <View className='mt-8 px-6'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-3xl font-bold text-gray-900'>
                맞춤 여행 추천
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/traveler/explore')}
              >
                <Text className='text-blue-600 font-semibold'>더보기</Text>
              </TouchableOpacity>
            </View>

            {isLoadingRecommended ? (
              <View className='py-8 items-center'>
                <ActivityIndicator size='large' color='#3B82F6' />
              </View>
            ) : recommendedSessions.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName='pr-2'
              >
                {/* 추천 상품 리스트 */}
                {recommendedSessions.map((session) => (
                  <TouchableOpacity
                    key={session.sessionId}
                    className='bg-white rounded-2xl mr-3 overflow-hidden shadow-sm border border-gray-100'
                    style={{ width: 180 }}
                    onPress={() =>
                      router.push(
                        `/traveler/trip/${session.sessionId}` as any
                      )
                    }
                  >
                    <View className='bg-gray-200' style={{ width: '100%', height: 120 }}>
                      {session.firstImageUrl ? (
                        <Image
                          source={{ uri: session.firstImageUrl }}
                          style={{ width: '100%', height: 120 }}
                          contentFit='cover'
                        />
                      ) : (
                        <View className='w-full h-full items-center justify-center'>
                          <Ionicons name='image-outline' size={40} color='#9CA3AF' />
                        </View>
                      )}
                    </View>
                    <View className='p-4'>
                      <Text
                        className='text-lg font-semibold text-gray-900 mb-2'
                        numberOfLines={2}
                      >
                        {session.title}
                      </Text>
                      <View className='flex-row items-center'>
                        <Ionicons
                          name='calendar-outline'
                          size={14}
                          color='#6B7280'
                        />
                        <Text className='text-sm text-gray-600 ml-1'>
                          {formatDateForDisplay(session.startDate)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className='py-8 items-center'>
                <Text className='text-gray-500 text-base'>
                  관심사에 맞는 여행을 찾을 수 없습니다
                </Text>
              </View>
            )}
          </View>

          {/* 이달의 가이드 순위 섹션 */}
          <View className='mt-8 px-6'>
            <Text className='text-3xl font-bold text-gray-900 mb-4'>
              이달의 가이드 TOP 3
            </Text>

            <View className='bg-white rounded-2xl p-1 mb-3 shadow-sm border border-gray-100'>
              <View className='flex-row items-center p-4 bg-purple-50 rounded-xl'>
                <View className='bg-purple-500 w-8 h-8 rounded-full items-center justify-center mr-3'>
                  <Text className='text-white font-bold'>1</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>
                    투어리즘(김영진)
                  </Text>
                  <Text className='text-sm text-gray-600'>4.95 / 5.0</Text>
                </View>
                <View className='flex-row items-center'>
                  <Ionicons name='star' size={20} color='#F59E0B' />
                </View>
              </View>
            </View>

            <View className='bg-white rounded-2xl p-1 mb-3 shadow-sm border border-gray-100'>
              <View className='flex-row items-center p-4 bg-orange-50 rounded-xl'>
                <View className='bg-orange-500 w-8 h-8 rounded-full items-center justify-center mr-3'>
                  <Text className='text-white font-bold'>2</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>
                    낫쏘리(안미안)
                  </Text>
                  <Text className='text-sm text-gray-600'>4.93 / 5.0</Text>
                </View>
                <View className='flex-row items-center'>
                  <Ionicons name='star' size={20} color='#F59E0B' />
                </View>
              </View>
            </View>

            <View className='bg-white rounded-2xl p-1 mb-3 shadow-sm border border-gray-100'>
              <View className='flex-row items-center p-4 bg-yellow-50 rounded-xl'>
                <View className='bg-yellow-500 w-8 h-8 rounded-full items-center justify-center mr-3'>
                  <Text className='text-white font-bold'>3</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>
                    전문가(전문가)
                  </Text>
                  <Text className='text-sm text-gray-600'>4.90 / 5.0</Text>
                </View>
                <View className='flex-row items-center'>
                  <Ionicons name='star' size={20} color='#F59E0B' />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
};

export default TravelerHomeScreen;