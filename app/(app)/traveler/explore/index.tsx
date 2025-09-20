import ProductList, { Product } from '@/components/explore/ProductList';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ProductSearchScreen: React.FC = () => {
  const products: Product[] = [
    { id: '1', title: '후쿠오카 놀러가실분', date: '2025.05.16 - 05.21', participants: '2/4명', location: '후쿠오카', guide: '홍 길동', rating: '4.8', imageUrl: 'https://via.placeholder.com/90' },
    { id: '2', title: '여수 식도락 여행', date: '2025.08.01 - 08.03', participants: '3/4명', location: '전남 여수', guide: '여수토박이', rating: '4.5', imageUrl: 'https://via.placeholder.com/90' },
    { id: '3', title: 'ㅇㅋㅇㅋ', date: '미정', participants: '1/3명', location: '오키나와', guide: '홍 길동', rating: '4.7', imageUrl: 'https://via.placeholder.com/90' },
    { id: '4', title: '모히또 관광', date: '2025.07.28 - 08.01', participants: '4/6명', location: '몰디브', guide: '투어리즘', rating: '-', imageUrl: 'https://via.placeholder.com/90' },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어 입력..."
        />
        <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
      </View>

      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="calendar-month" size={24} color="#8130FF" />
          <Text style={styles.filterButtonText}>일정 설정하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="location" size={24} color="#8130FF" />
          <Text style={styles.filterButtonText}>지역 선택하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterTags}>
        <TouchableOpacity style={styles.tagButtonActive}>
          <Text style={styles.tagButtonTextActive}>관심사: 음식, 쇼핑</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tagButtonActive}>
          <Text style={styles.tagButtonTextActive}>정렬: 날짜 순</Text>
        </TouchableOpacity>
      </View>

      <ProductList products={products} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: '#999',
  },
  searchIcon: {
    marginLeft: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 5,
  },
  filterTags: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tagButtonActive: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
    borderWidth: 1,
    marginRight: 10,
  },
  tagButtonTextActive: {
    fontSize: 20,
    color: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
});

export default ProductSearchScreen;
