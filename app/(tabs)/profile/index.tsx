import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TravelerMyPageScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={96} color="#999" />
          </View>
          <Text style={styles.profileName}>김 홍익</Text>
        </View>
        <Text style={styles.tripCount}>여행 0건, 가이드 0건</Text>
        <TouchableOpacity style={styles.switchButton}>
          <Text style={styles.switchButtonText}>{'여행자 <-> 가이드 전환하기'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>나의 관심사 설정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>회원탈퇴</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tripCount: {
    fontSize: 24,
    color: '#707070',
    marginBottom: 10,
  },
  switchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  switchButtonText: {
    fontSize: 20,
    color: '#000',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
  menuSection: {
    // 메뉴 섹션 스타일
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 24,
    color: '#000',
  },
});

export default TravelerMyPageScreen;
