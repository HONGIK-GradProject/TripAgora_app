import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WishListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>찜 목록</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.tabButtonActive]}>
          <Text style={styles.tabButtonTextActive}>상품</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>가이드</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.productList}>
          {/* 찜 목록 상품 리스트 (임시) */}
          <View style={styles.productItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>모히또 관광</Text>
              <Text style={styles.productDetails}>2025.07.28 - 08.01</Text>
              <Text style={styles.productDetails}>4/6명      몰디브</Text>
              <Text style={styles.productDetails}>-              투어리즘</Text>
            </View>
            <Ionicons name="heart" size={24} color="#8130FF" style={styles.wishIcon} />
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#8130FF',
  },
  tabButtonText: {
    fontSize: 20,
    color: '#999',
  },
  tabButtonTextActive: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8130FF',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
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
  wishIcon: {
    marginLeft: 10,
  },
});

export default WishListScreen;
