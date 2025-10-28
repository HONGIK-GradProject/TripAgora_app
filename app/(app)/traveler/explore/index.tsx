import SearchWithAutoComplete from '@/components/search-bar/SearchWithAutoComplete';
import ProductList from '@/components/traveler/explore/TravelerProductList';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { getPublicSessionList } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TravelerExploreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useRef를 사용하여 의존성 배열로 인한 무한 루프를 방지합니다.
  const stateRef = useRef({ isLoading, hasNextPage, page });
  stateRef.current = { isLoading, hasNextPage, page };

  // 세션 목록 가져오기
  const fetchSessions = useCallback(
    async (isRefresh: boolean) => {
      const pageToLoad = isRefresh ? 0 : stateRef.current.page;

      // ref를 통해 최신 상태를 확인합니다.
      if (
        stateRef.current.isLoading ||
        (!isRefresh && !stateRef.current.hasNextPage)
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log('Calling page ', pageToLoad);

      try {
        const response = await getPublicSessionList(['RECRUITING'], pageToLoad);
        if (response) {
          setSessions((prev) =>
            isRefresh ? response.sessions : [...prev, ...response.sessions]
          );
          setPage(pageToLoad + 1);
          setHasNextPage(response.hasNext);
        } else {
          setHasNextPage(false);
        }
      } catch (err) {
        setError(err as Error);
        console.error('세션 목록 조회 에러:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [] // 의존성 배열을 비워서 함수가 재생성되지 않도록 합니다.
  );

  const loadMore = useCallback(() => {
    // loadMore는 항상 false로 fetchSessions를 호출합니다.
    if (stateRef.current.hasNextPage && !stateRef.current.isLoading) {
      fetchSessions(false);
    }
  }, [fetchSessions]);

  const refetch = useCallback(() => {
    fetchSessions(true);
  }, [fetchSessions]);

  // 컴포넌트 마운트 시 세션 목록 가져오기
  useEffect(() => {
    fetchSessions(true);
  }, [fetchSessions]);

  // 세션 데이터를 Product 형태로 변환
  const products = useMemo(() => {
    return sessions.map((session) => ({
      id: session.sessionId.toString(),
      title: session.title,
      date: `${session.startDate} - ${session.endDate}`,
      participants: `${session.currentParticipants}/${session.maxParticipants}명`,
      location: (Array.isArray(session.regionIds) &&
      session.regionIds.length > 0
        ? session.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id])
        : (session as any).regionNames || []
      )
        .filter(Boolean)
        .join(', '),
      guide: '가이드', // TODO: 가이드 정보 추가 필요
      rating: '-' as const,
      imageUrl: session.firstImageUrl,
    }));
  }, [sessions]);

  const filteredProducts = useMemo(() => {
    if (!submittedQuery.trim()) {
      return products;
    }
    const lowercasedQuery = submittedQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercasedQuery) ||
        product.location.toLowerCase().includes(lowercasedQuery) ||
        product.guide.toLowerCase().includes(lowercasedQuery)
    );
  }, [products, submittedQuery]);

  // 자동완성 비활성화
  const handleFetchSuggestions = async (query: string) => {
    return [];
  };

  const handleSearch = (query: string) => {
    setSubmittedQuery(query);
  };

  return (
    <View className='flex-1 bg-white pt-12 relative'>
      <SearchWithAutoComplete
        query={searchQuery}
        onQueryChange={setSearchQuery}
        fetchSuggestions={handleFetchSuggestions}
        onSearch={handleSearch}
        placeholder='여행 상품을 검색해보세요!'
      />

      <View className='px-5'>
        <Text className='text-3xl font-bold mb-5'>여행 상품 탐색</Text>
      </View>

      {/* 필터 버튼들 */}
      <View className='px-5 mb-4'>
        <View className='flex-row justify-around mb-4'>
          <TouchableOpacity className='flex-row items-center py-3 px-6 rounded-2xl border border-gray-300 bg-white'>
            <MaterialCommunityIcons
              name='calendar-month'
              size={20}
              color='#8130FF'
            />
            <Text className='text-base text-primary ml-2'>일정 설정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex-row items-center py-3 px-6 rounded-2xl border border-gray-300 bg-white'>
            <Ionicons name='location' size={20} color='#8130FF' />
            <Text className='text-base text-primary ml-2'>지역 선택하기</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-row flex-wrap'>
          <TouchableOpacity className='py-2 px-4 rounded-2xl bg-primary mr-2 mb-2'>
            <Text className='text-sm text-white'>관심사: 음식, 쇼핑</Text>
          </TouchableOpacity>
          <TouchableOpacity className='py-2 px-4 rounded-2xl bg-primary mr-2 mb-2'>
            <Text className='text-sm text-white'>정렬: 날짜 순</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className='bg-gray-50 rounded-2xl p-4'
        style={{ marginBottom: 200 + insets.bottom }}
      >
        {error ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-red-500 text-lg'>
              세션 목록을 불러오는데 실패했습니다.
            </Text>
            <TouchableOpacity
              className='mt-4 px-6 py-3 bg-primary rounded-lg'
              onPress={refetch}
            >
              <Text className='text-white font-semibold'>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts.length === 0 && !isLoading ? (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-gray-500 text-lg'>
              모집 중인 여행이 없습니다.
            </Text>
          </View>
        ) : (
          <ProductList
            products={filteredProducts}
            onEndReached={loadMore}
            refreshControl={
              <RefreshControl
                refreshing={isLoading && sessions.length === 0}
                onRefresh={refetch}
                colors={['#8130FF']}
                tintColor='#8130FF'
              />
            }
            ListFooterComponent={
              isLoading && sessions.length > 0 ? (
                <View className='py-4 items-center'>
                  <ActivityIndicator size='small' color='#8130FF' />
                  <Text className='text-gray-500 text-sm mt-2'>
                    더 많은 세션을 불러오는 중...
                  </Text>
                </View>
              ) : undefined
            }
          />
        )}
      </View>
    </View>
  );
};

export default TravelerExploreScreen;
