import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useAuth } from '@/hooks/useAuth';
import { useSessionList } from '@/hooks/sessions/useSessionList';
import { SessionInfo } from '@/types/sessions';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GuideHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const { sessions, isLoading } = useSessionList();

  // 날짜를 표시용 형식으로 변환 (예: 2024.01.15)
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 모집 중인 세션만 필터링하고, 모집 인원이 가득 찬 순서대로 정렬한 후 최대 4개만 선택
  const displayedSessions = useMemo(() => {
    // 모집 중인 세션만 필터링 (RECRUITING, RECRUITMENT_CLOSED 상태)
    const recruitingSessions = sessions.filter((session) =>
      ['RECRUITING', 'RECRUITMENT_CLOSED'].includes(session.status)
    );

    // 모집 인원이 가득 찬 순서대로 정렬
    const sortedSessions = [...recruitingSessions].sort((a, b) => {
      const aIsFull = a.currentParticipants === a.maxParticipants;
      const bIsFull = b.currentParticipants === b.maxParticipants;

      // 가득 찬 세션이 먼저 오도록
      if (aIsFull && !bIsFull) return -1;
      if (!aIsFull && bIsFull) return 1;

      // 둘 다 가득 찬 경우 또는 둘 다 가득 차지 않은 경우, 참여율이 높은 순서대로
      const aRatio = a.currentParticipants / a.maxParticipants;
      const bRatio = b.currentParticipants / b.maxParticipants;
      return bRatio - aRatio;
    });

    // 최대 4개만 반환
    return sortedSessions.slice(0, 4);
  }, [sessions]);
  return (
    <CustomSafeAreaView>
      <View className='bg-gray-50'>
        {/* 헤더 */}
        <View className='bg-white pt-6 pb-4 px-6'>
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

        <ScrollView contentContainerStyle={{ paddingBottom: 70 + bottom + 24 }}>
          {/* 환영 배너 */}
          <View className='mx-6 mt-6'>
            <View className='bg-white rounded-2xl p-6 border border-gray-200'>
              <View className='flex-row items-center'>
                <View className='bg-purple-100 w-14 h-14 rounded-full items-center justify-center mr-4'>
                  <Ionicons name='rocket-outline' size={28} color='#8130FF' />
                </View>
                <View className='flex-1'>
                  <Text className='text-2xl font-bold text-gray-900 mb-1'>
                    가이드님, 반갑습니다!
                  </Text>
                  <Text className='text-gray-600 text-base'>
                    일정과 모집글을 작성해 여행객을 모집해보세요
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 내 여행 상품 섹션 */}
          <View className='mt-8 px-6'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-3xl font-bold text-gray-900'>
                내 여행 모집
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/guide/session')}
              >
                <Text className='text-purple-600 font-semibold'>더보기</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className='py-8 items-center'>
                <ActivityIndicator size='large' color='#8130FF' />
              </View>
            ) : displayedSessions.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName='pr-2'
              >
                {/* 가이드 상품 리스트 */}
                {displayedSessions.map((session) => (
                  <TouchableOpacity
                    key={session.sessionId}
                    className='bg-white rounded-2xl mr-3 overflow-hidden shadow-sm border border-gray-100'
                    style={{ width: 180 }}
                    onPress={() =>
                      router.push(
                        `/guide/session/${session.sessionId}` as any
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
                        {session.title || '제목 없음'}
                      </Text>
                      <View className='flex-row items-center justify-between'>
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
                        {session.currentParticipants === session.maxParticipants && (
                          <View className='px-2 py-0.5 rounded-full bg-purple-100'>
                            <Text className='text-xs font-semibold text-purple-600'>
                              모집완료
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className='py-8 items-center'>
                <Text className='text-gray-500 text-base'>
                  모집 중인 여행이 없습니다
                </Text>
              </View>
            )}
          </View>

          {/* 이달의 가이드 순위 섹션 */}
          <View className='mt-8 px-6'>
            <Text className='text-3xl font-bold text-gray-900 mb-4'>
              이달의 가이드 순위
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

            <TouchableOpacity className='bg-white rounded-2xl p-4 items-center border border-gray-200'>
              <Text className='text-purple-600 font-semibold'>
                전체 순위 보기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
};

export default GuideHomeScreen;
