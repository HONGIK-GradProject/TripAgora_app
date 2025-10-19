import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * 진행 중인 여행의 세션 룸 화면입니다.
 * 지도, 일정, 일행 위치 확인, 공지하기 기능을 제공합니다.
 */
const SessionRoomScreen: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);

  // 일행 위치 확인 기능
  const handleCheckLocations = () => {
    console.log('일행 위치 확인');
  };

  // 공지하기 기능
  const handleAnnounce = () => {
    router.push('/guide/session/announce');
  };

  // 일정 편집 기능
  const handleEditItinerary = () => {
    console.log('일정 편집');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 섹션 */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.sessionTitle}>홍대 1박2일 모임</Text>
            <Text style={styles.dateText}>2025.03.31 - 04.01</Text>
          </View>

          <View style={styles.participantInfo}>
            <Ionicons name='people' size={16} color='#6B7280' />
            <Text style={styles.participantText}>4/6명</Text>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.locationButton]}
            onPress={handleCheckLocations}
          >
            <Ionicons name='location' size={20} color='#8130FF' />
            <Text style={styles.actionButtonText}>일행 위치 확인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.announceButton]}
            onPress={handleAnnounce}
          >
            <Ionicons name='notifications' size={20} color='#FF8330' />
            <Text style={[styles.actionButtonText, styles.announceButtonText]}>
              공지하기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name='map' size={48} color='#9CA3AF' />
              <Text style={styles.mapPlaceholderText}>지도 영역</Text>
              <Text style={styles.mapSubText}>
                일행들의 위치와 일정이 표시됩니다
              </Text>
            </View>
          </View>
        </View>

        {/* 일정 편집 버튼 */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditItinerary}
        >
          <Text style={styles.editButtonText}>일정 편집하기</Text>
        </TouchableOpacity>

        {/* 일정 탭 */}
        <View style={styles.dayTabsContainer}>
          <TouchableOpacity
            style={[styles.dayTab, selectedDay === 1 && styles.dayTabActive]}
            onPress={() => setSelectedDay(1)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === 1 && styles.dayTabTextActive,
              ]}
            >
              1일차
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dayTab, selectedDay === 2 && styles.dayTabActive]}
            onPress={() => setSelectedDay(2)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === 2 && styles.dayTabTextActive,
              ]}
            >
              2일차
            </Text>
          </TouchableOpacity>
        </View>

        {/* 일정 목록 */}
        <View style={styles.itinerarySection}>
          <View style={styles.itineraryItem}>
            <View style={styles.itineraryTime}>
              <Text style={styles.itineraryTimeText}>10:00</Text>
            </View>
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryTitle}>홍대입구역 집합</Text>
              <Text style={styles.itineraryDescription}>
                홍대입구역 2번 출구에서 만나요
              </Text>
            </View>
          </View>

          <View style={styles.itineraryItem}>
            <View style={styles.itineraryTime}>
              <Text style={styles.itineraryTimeText}>12:00</Text>
            </View>
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryTitle}>점심 식사</Text>
              <Text style={styles.itineraryDescription}>
                홍대 맛집에서 함께 점심을 먹어요
              </Text>
            </View>
          </View>

          <View style={styles.itineraryItem}>
            <View style={styles.itineraryTime}>
              <Text style={styles.itineraryTimeText}>14:00</Text>
            </View>
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryTitle}>홍대 거리 탐방</Text>
              <Text style={styles.itineraryDescription}>
                홍대의 유명한 장소들을 둘러봐요
              </Text>
            </View>
          </View>

          <View style={styles.itineraryItem}>
            <View style={styles.itineraryTime}>
              <Text style={styles.itineraryTimeText}>18:00</Text>
            </View>
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryTitle}>저녁 식사</Text>
              <Text style={styles.itineraryDescription}>
                홍대에서 저녁을 먹고 숙소로 이동
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  participantText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    gap: 8,
  },
  locationButton: {
    backgroundColor: '#F3ECFF',
    borderColor: '#8130FF',
  },
  announceButton: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF8330',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8130FF',
  },
  announceButtonText: {
    color: '#FF8330',
  },
  mapSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  editButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
  dayTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#8130FF',
    backgroundColor: '#fff',
  },
  dayTabActive: {
    backgroundColor: '#8130FF',
  },
  dayTabText: {
    fontSize: 16,
    color: '#8130FF',
    fontWeight: '400',
  },
  dayTabTextActive: {
    color: '#fff',
  },
  itinerarySection: {
    paddingHorizontal: 20,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itineraryTime: {
    width: 70,
    marginRight: 16,
  },
  itineraryTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8130FF',
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itineraryDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default SessionRoomScreen;
