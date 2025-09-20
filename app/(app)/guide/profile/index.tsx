import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const GuideProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={48} color="#999" />
          </View>
          <Text style={styles.profileName}>김 홍익</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>프로필 편집</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.ratingSection}>
          <View style={styles.stars}>
            <Ionicons name="star" size={24} color="#8130FF" />
            <Ionicons name="star" size={24} color="#8130FF" />
            <Ionicons name="star" size={24} color="#8130FF" />
            <Ionicons name="star" size={24} color="#8130FF" />
            <Ionicons name="star-half" size={24} color="#8130FF" />
          </View>
          <Text style={styles.averageRatingText}>평균 별점 4.5</Text>
        </View>

        <View style={styles.introductionSection}>
          <Text style={styles.sectionTitle}>가이드 소개</Text>
          <Text style={styles.introductionText}>
            함께 즐거운 여행해요!{'\n'}
            #후쿠오카 #홍대 #음식 #액티비티
          </Text>
        </View>

        <View style={styles.guideProductsSection}>
          <Text style={styles.sectionTitle}>김 홍익 가이드님의 여행 상품</Text>
          <View style={styles.productList}>
            {/* 가이드 상품 리스트 (임시) */}
            <View style={styles.productItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.productImage} />
            </View>
            <View style={styles.productItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.productImage} />
            </View>
            <View style={styles.productItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.productImage} />
            </View>
            <View style={styles.productItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.productImage} />
            </View>
            <View style={styles.productItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.productImage} />
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.reviewAvatar} />
              <Text style={styles.reviewAuthor}>홍 길동, 후쿠오카 놀러가실분</Text>
            </View>
            <Text style={styles.reviewText}>★★★★☆ 리뷰 텍스트 2</Text>
            <Text style={styles.reviewMoreText}>리뷰 더보기...</Text>
          </View>
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.reviewAvatar} />
              <Text style={styles.reviewAuthor}>박 대기, 홍대 1박2일 모임</Text>
            </View>
            <Text style={styles.reviewText}>★★★★☆ 리뷰 텍스트 1</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editProfileButtonText: {
    fontSize: 20,
    color: '#000',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  averageRatingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  introductionSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  introductionText: {
    fontSize: 20,
    color: '#707070',
  },
  guideProductsSection: {
    marginBottom: 30,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%', // 2열 배치
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E9E9E9',
    height: 150, // 임시 높이
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moreButton: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  moreButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  reviewsSection: {
    marginBottom: 30,
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#D9D9D9',
  },
  reviewAuthor: {
    fontSize: 20,
    color: '#000',
  },
  reviewText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 5,
  },
  reviewMoreText: {
    fontSize: 20,
    color: '#000',
    textDecorationLine: 'underline',
  },
});

export default GuideProfileScreen;
