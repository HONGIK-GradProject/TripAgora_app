import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GuideHomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={48} color="#999" />
          </View>
          <Text style={styles.profileName}>김 홍익</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>가이드님, 반갑습니다!</Text>
            <Text style={styles.cardDescription}>
              일정과 모집글을 작성해{'\n'}여행객을 모집해 보세요!
            </Text>
          </View>
        </View>

        <View style={styles.recommendationSection}>
          <Text style={styles.sectionTitle}>김 홍익 가이드님의 여행 상품</Text>
          <View style={styles.recommendationList}>
            {/* 가이드 상품 리스트 (임시) */}
            <View style={styles.recommendationItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.recommendationImage} />
            </View>
            <View style={styles.recommendationItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.recommendationImage} />
            </View>
            <View style={styles.recommendationItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.recommendationImage} />
            </View>
            <View style={styles.recommendationItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.recommendationImage} />
            </View>
            <View style={styles.recommendationItem}>
              <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.recommendationImage} />
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.guideRankingSection}>
          <Text style={styles.sectionTitle}>이달의 가이드 순위</Text>
          <View style={styles.rankingItem}>
            <Text style={styles.rankingText}>투어리즘(김영진) 평점 4.95</Text>
          </View>
          <View style={styles.rankingItem}>
            <Text style={styles.rankingText}>낫쏘리(안미안) 평점 4.93</Text>
          </View>
          <View style={styles.rankingItem}>
            <Text style={styles.rankingText}>전문가(전문가) 평점 4.9</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>더보기...</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 20,
    color: '#000',
  },
  recommendationSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendationItem: {
    width: '48%', // 2열 배치
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E9E9E9',
    height: 150, // 임시 높이
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationImage: {
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
  guideRankingSection: {
    marginTop: 30,
  },
  rankingItem: {
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
  },
  rankingText: {
    fontSize: 24,
    color: '#000',
  },
});

export default GuideHomeScreen;
