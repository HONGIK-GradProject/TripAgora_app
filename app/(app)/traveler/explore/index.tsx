import SearchWithAutoComplete from '@/components/search-bar/SearchWithAutoComplete';
import ProductList from '@/components/traveler/explore/TravelerProductList';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TravelerExploreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');

  const products = useMemo(
    () => [
      {
        id: '1',
        title: '후쿠오카 놀러가실분',
        date: '2025.05.16 - 05.21',
        participants: '2/4명',
        location: '후쿠오카',
        guide: '홍 길동',
        rating: '4.8',
        imageUrl: 'https://via.placeholder.com/90',
      },
      {
        id: '2',
        title: '여수 식도락 여행',
        date: '2025.08.01 - 08.03',
        participants: '3/4명',
        location: '전남 여수',
        guide: '여수토박이',
        rating: '4.5',
        imageUrl: 'https://via.placeholder.com/90',
      },
      {
        id: '3',
        title: 'ㅇㅋㅇㅋ',
        date: '미정',
        participants: '1/3명',
        location: '오키나와',
        guide: '홍 길동',
        rating: '4.7',
        imageUrl: 'https://via.placeholder.com/90',
      },
      {
        id: '4',
        title: '모히또 관광',
        date: '2025.07.28 - 08.01',
        participants: '4/6명',
        location: '몰디브',
        guide: '투어리즘',
        rating: '-',
        imageUrl: 'https://via.placeholder.com/90',
      },
    ],
    []
  );

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
        <ProductList products={filteredProducts} />
      </View>
    </View>
  );
};

export default TravelerExploreScreen;
