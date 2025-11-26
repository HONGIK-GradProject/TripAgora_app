import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { useCompletedSessionList } from '@/hooks/sessions/useCompletedSessionList';
import { useParticipatingSessionList } from '@/hooks/sessions/useParticipatingSessionList';
import { cancelParticipation } from '@/services/sessions';
import { SessionCompletedInfo, SessionInfo } from '@/types/sessions';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TravelerTripListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>(
    'upcoming'
  );
  const router = useRouter();

  const {
    sessions: participatingSessions,
    isLoading: isLoadingParticipating,
    error: errorParticipating,
    loadMore: loadMoreParticipating,
    refetch: refetchParticipating,
  } = useParticipatingSessionList();

  const {
    sessions: completedSessions,
    isLoading: isLoadingCompleted,
    error: errorCompleted,
    loadMore: loadMoreCompleted,
    refetch: refetchCompleted,
  } = useCompletedSessionList();

  // 현재 탭에 따라 적절한 데이터 사용
  const sessions =
    activeTab === 'completed' ? completedSessions : participatingSessions;
  const isLoading =
    activeTab === 'completed' ? isLoadingCompleted : isLoadingParticipating;
  const error = activeTab === 'completed' ? errorCompleted : errorParticipating;

  // 탭 변경 시 데이터 새로고침
  const handleTabChange = useCallback(
    (tab: 'upcoming' | 'completed') => {
      setActiveTab(tab);
      if (tab === 'upcoming') {
        refetchParticipating([
          'RECRUITING',
          'RECRUITMENT_CLOSED',
          'IN_PROGRESS',
        ]);
      } else {
        // 완료 탭일 때도 진행 중인 여행을 조회하기 위해 participatingSessions도 새로고침
        refetchParticipating(['IN_PROGRESS']);
        refetchCompleted();
      }
    },
    [refetchParticipating, refetchCompleted]
  );

  // 현재 탭에 따른 데이터 필터링 및 정렬
  const filteredSessions = useMemo(() => {
    let filtered: (SessionInfo | SessionCompletedInfo)[] = [];

    if (activeTab === 'upcoming') {
      // 예정 탭에서는 진행 중인 여행(IN_PROGRESS) 제외
      filtered = sessions.filter(
        (session: SessionInfo | SessionCompletedInfo) =>
          ['RECRUITING', 'RECRUITMENT_CLOSED'].includes(session.status)
      );

      // 모집마감 > 모집 중 순서로 정렬
      filtered.sort(
        (
          a: SessionInfo | SessionCompletedInfo,
          b: SessionInfo | SessionCompletedInfo
        ) => {
          if (a.status === 'RECRUITMENT_CLOSED' && b.status === 'RECRUITING') {
            return -1; // a가 b보다 앞에 와야 함
          }
          if (a.status === 'RECRUITING' && b.status === 'RECRUITMENT_CLOSED') {
            return 1; // b가 a보다 앞에 와야 함
          }
          return 0; // 같은 상태면 순서 유지
        }
      );
    } else {
      // 완료 탭에서는 이미 완료된 세션만 반환되므로 필터링 불필요
      filtered = sessions;
    }

    return filtered;
  }, [sessions, activeTab]);

  // 현재 진행 중인 세션 (IN_PROGRESS 상태) - 탭과 관계없이 항상 표시
  const currentSession = useMemo(() => {
    // 탭과 관계없이 항상 participatingSessions에서 진행 중인 세션 찾기
    return participatingSessions.find(
      (session) => session.status === 'IN_PROGRESS'
    );
  }, [participatingSessions]);

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'upcoming') {
        refetchParticipating([
          'RECRUITING',
          'RECRUITMENT_CLOSED',
          'IN_PROGRESS',
        ]);
      } else {
        // 완료 탭일 때도 진행 중인 여행을 조회하기 위해 participatingSessions도 새로고침
        refetchParticipating(['IN_PROGRESS']);
        refetchCompleted();
      }
    }, [activeTab, refetchParticipating, refetchCompleted])
  );

  /**
   * 세션 상태에 따른 배지 색상과 텍스트를 반환합니다.
   */
  const getStatusBadge = useCallback((status: string) => {
    const statusMap = {
      RECRUITING: {
        bg: 'bg-[#E6E9FF]',
        text: 'text-[#5B67F5]',
        label: '모집 중',
      },
      RECRUITMENT_CLOSED: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        label: '모집마감',
      },
      IN_PROGRESS: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        label: '진행중',
      },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: '완료' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.IN_PROGRESS;
  }, []);

  /**
   * 리스트의 끝에 도달하여 추가 데이터를 로딩할 때 표시될 푸터 컴포넌트를 렌더링합니다.
   */
  const renderFooter = () => {
    // 추가 페이지 로딩 시에만 하단 로딩 아이콘 표시
    if (isLoading && filteredSessions.length > 0) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  /**
   * 세션 삭제 핸들러
   */
  const handleDeleteSession = useCallback(
    async (sessionId: number) => {
      Alert.alert(
        '여행 기록 삭제',
        '이 여행을 목록에서 삭제하시겠습니까?\n삭제 후 복구가 불가능합니다.',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            style: 'destructive',
            onPress: async () => {
              try {
                await cancelParticipation(sessionId);
                // 삭제 성공 시 목록 새로고침
                refetchCompleted();
              } catch (error) {
                Alert.alert('오류', '여행 기록 삭제에 실패했습니다.');
              }
            },
          },
        ]
      );
    },
    [refetchCompleted]
  );

  /**
   * 세션 아이템을 렌더링하는 함수
   */
  const renderSessionItem = ({
    item: session,
  }: {
    item: SessionInfo | SessionCompletedInfo;
  }) => {
    const badge = getStatusBadge(session.status);
    const isCompleted = session.status === 'COMPLETED';
    // 완료된 세션인 경우 hasWrittenReview 확인 (SessionCompletedInfo 타입)
    const hasWrittenReview =
      isCompleted && 'hasWrittenReview' in session
        ? session.hasWrittenReview
        : false;

    return (
      <View className='bg-white rounded-2xl mb-2 shadow-sm border border-gray-100 overflow-hidden'>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            // RECRUITING → 상세 / RECRUITMENT_CLOSED, IN_PROGRESS → 룸
            if (
              session.status === 'IN_PROGRESS' ||
              session.status === 'RECRUITMENT_CLOSED'
            ) {
              const roomIdParam = session.roomId
                ? `?roomId=${session.roomId}`
                : '';
              router.push(
                `/traveler/trip/${session.sessionId}/session-room/${roomIdParam}` as any
              );
            } else {
              router.push(`/traveler/trip/${session.sessionId}` as any);
            }
          }}
        >
          <View className='p-5'>
            <View className='flex-row items-center'>
              <Image
                source={{ uri: session.firstImageUrl }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  marginRight: 16,
                }}
                contentFit='cover'
              />
              <View className='flex-1'>
                <Text className='text-lg font-semibold text-gray-900 mb-1'>
                  {session.title?.trim() || '제목 없음'}
                </Text>
                <Text className='text-gray-600 mb-2'>
                  {session.startDate} ~ {session.endDate}
                </Text>
                <View className='flex-row items-start'>
                  <MaterialIcons
                    name='person-outline'
                    size={16}
                    color='#6B7280'
                    style={{ marginTop: 2 }}
                  />
                  <Text className='text-gray-600 ml-1 mr-4'>
                    {session.currentParticipants}/{session.maxParticipants}명
                  </Text>
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
                    {(Array.isArray(session.regionIds) &&
                    session.regionIds.length > 0
                      ? session.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id])
                      : (session as any).regionNames || []
                    )
                      .filter(Boolean)
                      .join(', ') || '지역 정보 없음'}
                  </Text>
                </View>
              </View>
              <View className={`px-3 py-1 rounded-full ${badge.bg}`}>
                <Text className={`text-sm ${badge.text}`}>{badge.label}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 완료된 세션 하단 버튼들 */}
        {isCompleted && (
          <View className='px-5 pb-5 border-t border-gray-100'>
            {/* 리뷰를 작성한 적이 없는 경우 리뷰 버튼 표시 */}
            {!hasWrittenReview && (
              <TouchableOpacity
                className='bg-purple-500 rounded-xl py-3 flex-row items-center justify-center mb-2'
                onPress={() =>
                  router.push({
                    pathname: '/ReviewWriteScreen',
                    params: { sessionId: session.sessionId.toString() },
                  } as any)
                }
                activeOpacity={0.8}
              >
                <Ionicons name='star' size={20} color='#fff' />
                <Text className='text-white font-semibold text-base ml-2'>
                  리뷰 작성하기
                </Text>
              </TouchableOpacity>
            )}
            {/* 세션 삭제 버튼 */}
            <TouchableOpacity
              className='bg-red-500 rounded-xl py-3 flex-row items-center justify-center'
              onPress={() => handleDeleteSession(session.sessionId)}
              activeOpacity={0.8}
            >
              <Ionicons name='trash-outline' size={20} color='#fff' />
              <Text className='text-white font-semibold text-base ml-2'>
                여행 기록 삭제
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-gray-50'>
        {/* 헤더 */}
        <View className='bg-white pt-6 pb-4 px-6'>
          <Text className='text-3xl font-bold text-gray-900'>
            나의 여행 목록
          </Text>
        </View>

        {/* 현재 진행 중인 여행 섹션 */}
        {currentSession && (
          <View className='px-6 py-4'>
            <Text className='text-xl font-semibold text-gray-800 mb-3'>
              현재 진행 중인 여행
            </Text>

            <TouchableOpacity
              className='rounded-2xl p-5 border-2'
              style={{ borderColor: '#3B82F6', backgroundColor: '#FFFFFF' }}
              onPress={() => {
                // 진행 중인 여행은 세션 룸으로 이동
                const roomIdParam = currentSession.roomId
                  ? `?roomId=${currentSession.roomId}`
                  : '';
                router.push(
                  `/traveler/trip/${currentSession.sessionId}/session-room/${roomIdParam}` as any
                );
              }}
            >
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: currentSession.firstImageUrl }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    marginRight: 16,
                  }}
                  contentFit='cover'
                />
                <View className='flex-1'>
                  <View className='flex-row items-center mb-2 gap-2'>
                    <View
                      className='px-3 py-1 rounded-full'
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <Text
                        className='text-sm font-semibold'
                        style={{ color: '#3B82F6' }}
                      >
                        진행중
                      </Text>
                    </View>
                    <View
                      className='px-3 py-1 rounded-full'
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <Text
                        className='text-xs font-medium'
                        style={{ color: '#2563EB' }}
                      >
                        여행자
                      </Text>
                    </View>
                  </View>
                  <Text className='text-xl font-bold text-gray-900 mb-1'>
                    {currentSession.title?.trim() || '제목 없음'}
                  </Text>
                  <Text className='text-gray-600 mb-2'>
                    {currentSession.startDate} ~ {currentSession.endDate}
                  </Text>
                  <View className='flex-row items-start'>
                    <MaterialIcons
                      name='person-outline'
                      size={16}
                      color='#3B82F6'
                      style={{ marginTop: 2 }}
                    />
                    <Text className='text-gray-700 ml-1 mr-4'>
                      {currentSession.currentParticipants}명
                    </Text>
                    <Ionicons
                      name='location-outline'
                      size={16}
                      color='#3B82F6'
                      style={{ marginTop: 2 }}
                    />
                    <Text
                      className='text-gray-700 ml-1 flex-1'
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {(Array.isArray(currentSession.regionIds) &&
                      currentSession.regionIds.length > 0
                        ? currentSession.regionIds.map(
                            (id) => REGION_ID_TO_NAME_MAP[id]
                          )
                        : (currentSession as any).regionNames || []
                      )
                        .filter(Boolean)
                        .join(', ') || '지역 정보 없음'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 탭 메뉴 */}
        <View className='bg-white px-6 py-2 border-b border-gray-200'>
          <View className='flex-row bg-gray-100 rounded-xl p-1'>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                activeTab === 'upcoming' ? 'bg-white' : ''
              }`}
              onPress={() => handleTabChange('upcoming')}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'upcoming' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                예정
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                activeTab === 'completed' ? 'bg-white' : ''
              }`}
              onPress={() => handleTabChange('completed')}
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
        <View className='flex-1 px-6 pt-4'>
          {(() => {
            if (isLoading && filteredSessions.length === 0) {
              return (
                <View className='flex-1 items-center justify-center py-20'>
                  <ActivityIndicator size='large' color='#3B82F6' />
                  <Text className='text-gray-500 text-lg mt-4'>로딩 중...</Text>
                </View>
              );
            }

            if (error && filteredSessions.length === 0) {
              return (
                <View className='flex-1 items-center justify-center py-20'>
                  <Text className='text-red-500 text-lg'>
                    오류가 발생했습니다.
                  </Text>
                </View>
              );
            }

            if (filteredSessions.length === 0) {
              return (
                <View className='flex-1 items-center justify-center py-20'>
                  <Text className='text-gray-500 text-lg'>
                    {activeTab === 'upcoming'
                      ? '예정된 여행이 없습니다.'
                      : '완료된 여행이 없습니다.'}
                  </Text>
                </View>
              );
            }

            return (
              <FlatList
                data={filteredSessions}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item.sessionId.toString()}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  if (activeTab === 'upcoming') {
                    loadMoreParticipating([
                      'RECRUITING',
                      'RECRUITMENT_CLOSED',
                      'IN_PROGRESS',
                    ]);
                  } else {
                    loadMoreCompleted();
                  }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading && filteredSessions.length > 0}
                    onRefresh={() => {
                      if (activeTab === 'upcoming') {
                        refetchParticipating([
                          'RECRUITING',
                          'RECRUITMENT_CLOSED',
                          'IN_PROGRESS',
                        ]);
                      } else {
                        refetchCompleted();
                      }
                    }}
                  />
                }
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            );
          })()}
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default TravelerTripListScreen;
