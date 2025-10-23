import { useSessionList } from '@/hooks/sessions/useSessionList';
import { SessionInfo } from '@/types/sessions';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const GuideTripListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>(
    'ongoing'
  );
  const router = useRouter();

  const { sessions, isLoading, error, loadMore, refetch } = useSessionList();

  // 탭 변경 시 데이터 새로고침
  const handleTabChange = useCallback(
    (tab: 'ongoing' | 'completed') => {
      setActiveTab(tab);
      const statuses =
        tab === 'ongoing'
          ? ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS']
          : ['COMPLETED', 'IN_PROGRESS'];
      refetch(statuses);
    },
    [refetch]
  );

  // 현재 탭에 따른 데이터 필터링 및 정렬
  const filteredSessions = useMemo(() => {
    let filtered = [];

    if (activeTab === 'ongoing') {
      // 모집 중 탭에서는 진행 중인 여행(IN_PROGRESS) 제외
      filtered = sessions.filter((session) =>
        ['RECRUITING', 'RECRUITMENT_CLOSED'].includes(session.status)
      );

      // 모집마감 > 모집중 순서로 정렬
      filtered.sort((a, b) => {
        if (a.status === 'RECRUITMENT_CLOSED' && b.status === 'RECRUITING') {
          return -1; // a가 b보다 앞에 와야 함
        }
        if (a.status === 'RECRUITING' && b.status === 'RECRUITMENT_CLOSED') {
          return 1; // b가 a보다 앞에 와야 함
        }
        return 0; // 같은 상태면 순서 유지
      });
    } else {
      filtered = sessions.filter((session) => session.status === 'COMPLETED');
    }

    return filtered;
  }, [sessions, activeTab]);

  // 현재 진행 중인 세션 (IN_PROGRESS 상태)
  const currentSession = useMemo(() => {
    return sessions.find((session) => session.status === 'IN_PROGRESS');
  }, [sessions]);

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      const statuses =
        activeTab === 'ongoing'
          ? ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS']
          : ['COMPLETED', 'IN_PROGRESS'];
      refetch(statuses);
    }, [activeTab, refetch])
  );

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
   * 세션 아이템을 렌더링하는 함수
   */
  const renderSessionItem = ({ item: session }: { item: SessionInfo }) => (
    <TouchableOpacity
      className='bg-white rounded-2xl mb-2 p-5 shadow-sm border border-gray-100'
      onPress={() =>
        router.push(`/guide/session/${session.sessionId.toString()}` as any)
      }
    >
      <View className='flex-row items-center'>
        <Image
          source={{ uri: session.firstImageUrl }}
          style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
          contentFit='cover'
        />
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900 mb-1'>
            {session.title}
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
              {session.regionNames.join(', ')}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            session.status === 'RECRUITING'
              ? 'bg-purple-100'
              : session.status === 'RECRUITMENT_CLOSED'
              ? 'bg-orange-100'
              : session.status === 'COMPLETED'
              ? 'bg-green-100'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-sm ${
              session.status === 'RECRUITING'
                ? 'text-purple-700'
                : session.status === 'RECRUITMENT_CLOSED'
                ? 'text-orange-700'
                : session.status === 'COMPLETED'
                ? 'text-green-700'
                : 'text-gray-600'
            }`}
          >
            {session.status === 'RECRUITING' && '모집중'}
            {session.status === 'RECRUITMENT_CLOSED' && '모집마감'}
            {session.status === 'IN_PROGRESS' && '진행중'}
            {session.status === 'COMPLETED' && '완료'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 bg-gray-50'>
      {/* 헤더 */}
      <View className='bg-white pt-12 pb-4 px-6'>
        <Text className='text-3xl font-bold text-gray-900'>나의 여행 목록</Text>
      </View>

      {/* 현재 진행 중인 여행 섹션 */}
      {currentSession && (
        <View className='px-6 py-4'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>
            현재 진행 중인 여행
          </Text>

          <TouchableOpacity
            className='bg-purple-500 rounded-2xl p-5'
            onPress={() =>
              router.push(
                `/guide/session/${currentSession.sessionId.toString()}` as any
              )
            }
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
                <View className='flex-row items-center mb-2'>
                  <View className='bg-white/20 px-3 py-1 rounded-full mr-2'>
                    <Text className='text-sm font-semibold text-white'>
                      진행중
                    </Text>
                  </View>
                </View>
                <Text className='text-xl font-bold text-white mb-1'>
                  {currentSession.title}
                </Text>
                <Text className='text-white/90 mb-2'>
                  {currentSession.startDate} ~ {currentSession.endDate}
                </Text>
                <View className='flex-row items-start'>
                  <MaterialIcons
                    name='person-outline'
                    size={16}
                    color='white'
                    style={{ marginTop: 2 }}
                  />
                  <Text className='text-white/90 ml-1 mr-4'>
                    {currentSession.currentParticipants}명
                  </Text>
                  <Ionicons
                    name='location-outline'
                    size={16}
                    color='white'
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    className='text-white/90 ml-1 flex-1'
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    {currentSession.regionNames.join(', ')}
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
              activeTab === 'ongoing' ? 'bg-white' : ''
            }`}
            onPress={() => handleTabChange('ongoing')}
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
      <View className='flex-1 px-6 py-4'>
        {isLoading && filteredSessions.length === 0 ? (
          <View className='flex-1 items-center justify-center py-20'>
            <ActivityIndicator size='large' color='#8130FF' />
            <Text className='text-gray-500 text-lg mt-4'>로딩 중...</Text>
          </View>
        ) : error ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-red-500 text-lg'>오류가 발생했습니다.</Text>
          </View>
        ) : filteredSessions.length === 0 ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-gray-500 text-lg'>
              {activeTab === 'ongoing'
                ? '모집 중인 여행이 없습니다.'
                : '완료된 여행이 없습니다.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSessions}
            renderItem={renderSessionItem}
            keyExtractor={(item) => item.sessionId.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              const statuses =
                activeTab === 'ongoing'
                  ? ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS']
                  : ['COMPLETED', 'IN_PROGRESS'];
              loadMore(statuses);
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isLoading && filteredSessions.length > 0}
                onRefresh={() => {
                  const statuses =
                    activeTab === 'ongoing'
                      ? ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS']
                      : ['COMPLETED', 'IN_PROGRESS'];
                  refetch(statuses);
                }}
              />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
};

export default GuideTripListScreen;
