import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GuideTripListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 여행 목록</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.tabButtonActive]}>
          <Text style={styles.tabButtonTextActive}>예정 / 진행 중</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tripList}>
          {/* 예정 / 진행 중인 여행 리스트 (임시) */}
          <View style={styles.tripItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.tripImage} />
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitleText}>홍대 1박2일 모임</Text>
              <Text style={styles.tripDetails}>2025.03.31 - 04.01</Text>
              <Text style={styles.tripDetails}>4명          홍대</Text>
            </View>
          </View>

          <View style={styles.tripItem}>
            <Image source={{ uri: 'https://via.placeholder.com/90' }} style={styles.tripImage} />
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitleText}>후쿠오카 놀러가실분</Text>
              <Text style={styles.tripDetails}>2025.05.16 - 05.21</Text>
              <Text style={styles.tripDetails}>4명          후쿠오카</Text>
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
  tripList: {
    // 여행 리스트 스타일
  },
  tripItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  tripImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripDetails: {
    fontSize: 20,
    color: '#000',
  },
});

export default GuideTripListScreen;
