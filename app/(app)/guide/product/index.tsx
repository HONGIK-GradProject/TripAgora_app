import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyProductsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="내 여행 모집 검색하기"
        />
        <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={60} color="#613EEA" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>모집 중인 내 상품</Text>
        <View style={styles.productList}>
          {/* 모집 중인 상품 리스트 (임시) */}
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>홍대 1박2일 모임</Text>
              <Text style={styles.productDetails}>2025.03.31 - 04.01</Text>
              <Text style={styles.productDetails}>4명          홍대</Text>
            </View>
          </View>
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>후쿠오카 놀러가실분</Text>
              <Text style={styles.productDetails}>2025.05.16 - 05.21</Text>
              <Text style={styles.productDetails}>2/4명      일본, 후쿠오카</Text>
            </View>
          </View>
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>모히또 관광</Text>
              <Text style={styles.productDetails}>2025.07.28 - 08.01</Text>
              <Text style={styles.productDetails}>4/6명      몰디브</Text>
            </View>
          </View>
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>여수 식도락 여행</Text>
              <Text style={styles.productDetails}>2025.08.01 - 08.03</Text>
              <Text style={styles.productDetails}>3/4명      전남 여수</Text>
            </View>
          </View>
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>ㅇㅋ 미정</Text>
              <Text style={styles.productDetails}>미정</Text>
              <Text style={styles.productDetails}>1/3명       일본, 오키나와</Text>
            </View>
          </View>
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>경주 2박3일</Text>
              <Text style={styles.productDetails}>2025.04.01 - 04.04</Text>
              <Text style={styles.productDetails}>2/3명      경북 경주</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: '#999',
  },
  searchIcon: {
    marginLeft: 10,
  },
  addButton: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productList: {
    // 상품 리스트 스타일
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 20,
    color: '#000',
  },
});

export default MyProductsScreen;
