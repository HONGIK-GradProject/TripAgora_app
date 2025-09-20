import ProductList, { Product } from '@/components/explore/ProductList';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const ProductSearchScreen: React.FC = () => {
  const products: Product[] = [
    { id: '1', title: '후쿠오카 놀러가실분', date: '2025.05.16 - 05.21', participants: '2/4명', location: '후쿠오카', guide: '홍 길동', rating: '4.8', imageUrl: 'https://via.placeholder.com/90' },
    { id: '2', title: '여수 식도락 여행', date: '2025.08.01 - 08.03', participants: '3/4명', location: '전남 여수', guide: '여수토박이', rating: '4.5', imageUrl: 'https://via.placeholder.com/90' },
    { id: '3', title: 'ㅇㅋㅇㅋ', date: '미정', participants: '1/3명', location: '오키나와', guide: '홍 길동', rating: '4.7', imageUrl: 'https://via.placeholder.com/90' },
    { id: '4', title: '모히또 관광', date: '2025.07.28 - 08.01', participants: '4/6명', location: '몰디브', guide: '투어리즘', rating: '-', imageUrl: 'https://via.placeholder.com/90' },
  ];
  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row items-center border-b border-gray-400 mx-5 pb-2.5 mb-5">
        <TextInput
          className="flex-1 text-xl text-gray-400"
          placeholder="검색어 입력..."
        />
        <Ionicons name="search" size={24} color="#999" className="ml-2.5" />
      </View>

      <View className="flex-row justify-around mx-5 mb-5">
        <TouchableOpacity className="flex-row items-center py-2.5 px-4 rounded-3xl border border-gray-400">
          <MaterialCommunityIcons name="calendar-month" size={24} color="#8130FF" />
          <Text className="text-xl text-primary ml-1">일정 설정하기</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-2.5 px-4 rounded-3xl border border-gray-400">
          <Ionicons name="location" size={24} color="#8130FF" />
          <Text className="text-xl text-primary ml-1">지역 선택하기</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mx-5 mb-5">
        <TouchableOpacity className="py-2.5 px-4 rounded-3xl bg-primary border border-primary mr-2.5">
          <Text className="text-xl text-white">관심사: 음식, 쇼핑</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-2.5 px-4 rounded-3xl bg-primary border border-primary mr-2.5">
          <Text className="text-xl text-white">정렬: 날짜 순</Text>
        </TouchableOpacity>
      </View>

      <ProductList products={products} />
    </View>
  );
};

export default ProductSearchScreen;