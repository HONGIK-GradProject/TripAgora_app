import ProductList from '@/components/traveler/explore/TravelerProductList';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { getWishlist } from '@/services/wishlist';
import { SessionInfo } from '@/types/sessions';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
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
  const [error, setError] = useState<Error | null>(null);

  // 위시리스트 목록 가져오기
  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 위시리스트 목록 가져오기
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // 세션 데이터를 Product 형태로 변환
  const products = useMemo(() => {
    return sessions.map((session) => ({
      id: session.sessionId.toString(),
      title: session.title,
      date: `${formatDate(session.startDate)} - ${formatDate(session.endDate)}`,
      participants: `${session.currentParticipants}/${session.maxParticipants}명`,
      location: (Array.isArray(session.regionIds) &&
      session.regionIds.length > 0
        ? session.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id])
        : []
      )
        .filter(Boolean)
        .join(', '),
      guide: '가이드', // TODO: 가이드 정보 추가 필요
      rating: '-' as const,
      imageUrl: session.firstImageUrl,
    }));
  }, [sessions]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <View className='flex-1 bg-white pt-12'>
      <View className='flex-row items-center justify-center px-5 pb-2.5 mb-5'>
        <Text className='text-4xl font-bold'>찜 목록</Text>
      </View>

      <View className='flex-row border-b border-gray-400 mx-5 mb-5'>
        <TouchableOpacity
          className={`flex-1 items-center py-2.5 border-b ${
            activeTab === 'product' ? 'border-primary' : 'border-transparent'
          }`}
          onPress={() => setActiveTab('product')}
        >
          <Text
            className={`text-xl ${
              activeTab === 'product'
                ? 'font-bold text-primary'
                : 'text-gray-400'
            }`}
          >
            상품
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-2.5 border-b ${
            activeTab === 'guide' ? 'border-primary' : 'border-transparent'
          }`}
          onPress={() => setActiveTab('guide')}
        >
          <Text
            className={`text-xl ${
              activeTab === 'guide' ? 'font-bold text-primary' : 'text-gray-400'
            }`}
          >
            가이드
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className='bg-gray-50 rounded-2xl p-4'
        style={{ marginBottom: 100 + insets.bottom }}
      >
        {activeTab === 'product' ? (
          <>
            {error ? (
              <View className='flex-1 items-center justify-center py-20'>
                <Text className='text-red-500 text-lg'>
                  위시리스트를 불러오는데 실패했습니다.
                </Text>
                <TouchableOpacity
                  className='mt-4 px-6 py-3 bg-primary rounded-lg'
                  onPress={fetchWishlist}
                >
                  <Text className='text-white font-semibold'>다시 시도</Text>
                </TouchableOpacity>
              </View>
            ) : products.length === 0 && !isLoading ? (
              <View className='flex-1 items-center justify-center py-20'>
                <Ionicons name='heart-outline' size={64} color='#D1D5DB' />
                <Text className='text-gray-500 text-lg mt-4'>
                  찜한 상품이 없습니다.
                </Text>
                <Text className='text-gray-400 text-sm mt-2'>
                  여행 상품을 찜해보세요!
                </Text>
              </View>
            ) : (
              <ProductList
                products={products}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading && sessions.length === 0}
                    onRefresh={fetchWishlist}
                    colors={['#8130FF']}
                    tintColor='#8130FF'
                  />
                }
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
  );
};

export default WishListScreen;
