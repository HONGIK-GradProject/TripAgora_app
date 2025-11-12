import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import ProductList from '@/components/traveler/explore/TravelerProductList';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { getWishlist } from '@/services/wishlist';
import { SessionInfo } from '@/types/sessions';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WishListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState('product');
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 위시리스트 목록 가져오기
  const fetchWishlist = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await getWishlist();
      if (response) {
        setSessions(response.sessions);
      } else {
        setSessions([]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('위시리스트 조회 에러:', err);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // 컴포넌트 마운트 시 위시리스트 목록 가져오기
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // 날짜 포맷팅 함수
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  }, []);

  // 세션 데이터를 Product 형태로 변환
  const products = useMemo(() => {
    return sessions.map((session) => ({
      id: session.sessionId.toString(),
      title: session.title?.trim() || '제목 없음',
      date: `${formatDate(session.startDate)} - ${formatDate(session.endDate)}`,
      participants: `${session.currentParticipants}/${session.maxParticipants}명`,
      location:
        (Array.isArray(session.regionIds) && session.regionIds.length > 0
          ? session.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id])
          : []
        )
          .filter(Boolean)
          .join(', ') || '지역 정보 없음',
      guide: '가이드', // TODO: 가이드 정보 추가 필요
      rating: '-' as const,
      imageUrl: session.firstImageUrl,
    }));
  }, [sessions, formatDate]);

  return (
    <CustomSafeAreaView>
      <View className='flex-1 pt-6 bg-white'>
        <View className='pb-4 px-6'>
          <Text className='text-3xl font-bold text-gray-900'>나의 찜 목록</Text>
        </View>

        <View className='flex-1 bg-gray-50 p-4'>
          {activeTab === 'product' ? (
            <>
              {error ? (
                <View className='flex-1 items-center justify-center py-20'>
                  <Text className='text-red-500 text-lg'>
                    위시리스트를 불러오는데 실패했습니다.
                  </Text>
                  <TouchableOpacity
                    className='mt-4 px-6 py-3 bg-primary rounded-lg'
                    onPress={() => fetchWishlist(false)}
                  >
                    <Text className='text-white font-semibold'>다시 시도</Text>
                  </TouchableOpacity>
                </View>
              ) : products.length === 0 && !isLoading ? (
                <ScrollView
                  className='flex-1'
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 80,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={() => fetchWishlist(true)}
                      colors={['#8130FF']}
                      tintColor='#8130FF'
                    />
                  }
                >
                  <Ionicons name='heart-outline' size={64} color='#D1D5DB' />
                  <Text className='text-gray-500 text-lg mt-4'>
                    찜한 상품이 없습니다.
                  </Text>
                  <Text className='text-gray-400 text-sm mt-2'>
                    여행 상품을 찜해보세요!
                  </Text>
                </ScrollView>
              ) : (
                <ProductList
                  products={products}
                  detailPath='/traveler/wishlist/[id]'
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={() => fetchWishlist(true)}
                      colors={['#8130FF']}
                      tintColor='#8130FF'
                    />
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 100 + insets.bottom,
                  }}
                  ListFooterComponent={
                    isLoading && sessions.length > 0 ? (
                      <View className='py-4 items-center'>
                        <ActivityIndicator size='small' color='#8130FF' />
                        <Text className='text-gray-500 text-sm mt-2'>
                          위시리스트를 불러오는 중...
                        </Text>
                      </View>
                    ) : undefined
                  }
                />
              )}
            </>
          ) : (
            <View className='flex-1 items-center justify-center py-20'>
              <Ionicons name='people-outline' size={64} color='#D1D5DB' />
              <Text className='text-gray-500 text-lg mt-4'>
                찜한 가이드가 없습니다.
              </Text>
              <Text className='text-gray-400 text-sm mt-2'>
                가이드를 찜해보세요!
              </Text>
            </View>
          )}
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default WishListScreen;
