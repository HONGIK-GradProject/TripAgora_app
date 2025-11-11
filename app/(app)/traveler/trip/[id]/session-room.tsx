import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * 여행자용 진행 중인 여행의 세션 룸 화면입니다.
 * 지도, 일정, 일행 위치 확인 기능을 제공합니다.
 */
const TravelerSessionRoomContent: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // sessionId는 SessionDetailsProvider에서 관리

  // 세션 상세 정보 가져오기
  const sessionDetails = useSessionDetails();
  const {
    title = '',
    startDate = '',
    endDate = '',
    maxParticipants = 0,
    currentParticipants = 0,
    itineraries = {},
    isLoading = true,
  } = sessionDetails || {};

  // 일정 관련 상태
  const availableDays = useMemo(
    () =>
      Object.entries(itineraries)
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([day]) => Number(day))
        .sort((a, b) => a - b),
    [itineraries]
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(
    availableDays.length > 0 ? availableDays[0] : null
  );

  useEffect(() => {
    if (availableDays.length === 0) {
      setSelectedDay(null);
      return;
    }

    setSelectedDay((prev) => {
      if (prev !== null && availableDays.includes(prev)) {
        return prev;
      }

      return availableDays[0];
    });
  }, [availableDays]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  // 일행 위치 확인 기능
  const handleCheckLocations = () => {
    console.log('일행 확인하기');
  };

  // SOS 보내기 기능
  const handleSendSOS = () => {
    Alert.alert('SOS 보내기', '긴급 상황을 일행에게 알리시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '보내기',
        style: 'destructive',
        onPress: () => {
          console.log('SOS 보내기');
          // TODO: SOS 보내기 API 호출
        },
      },
    ]);
  };

  // 로딩 중일 때
  if (isLoading) {
    return <FullScreenLoader />;
  }

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
            <Text style={styles.sessionTitle}>{title}</Text>
            <Text style={styles.dateText}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => {
              router.push(`/traveler/trip/${id}` as any);
            }}
          >
            <Ionicons
              name='information-circle-outline'
              size={24}
              color='#000'
            />
          </TouchableOpacity>
        </View>

        {/* 액션 버튼 */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.locationButton]}
            onPress={handleCheckLocations}
          >
            <Ionicons name='location' size={20} color='#8130FF' />
            <Text style={styles.actionButtonText}>일행 확인하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.noticeButton]}
            onPress={() => {
              router.push(`/traveler/trip/${id}/notice` as any);
            }}
          >
            <Ionicons name='megaphone' size={20} color='#FF8330' />
            <Text style={[styles.actionButtonText, styles.noticeButtonText]}>
              공지 목록
            </Text>
          </TouchableOpacity>
        </View>

        {/* SOS 버튼 - 긴급 상황 대응 */}
        <View style={styles.sosButtonContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSendSOS}
            activeOpacity={0.8}
          >
            <Ionicons name='alert-circle' size={24} color='#fff' />
            <Text style={styles.sosButtonText}>SOS 보내기</Text>
          </TouchableOpacity>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name='map' size={48} color='#9CA3AF' />
              <Text style={styles.mapPlaceholderText}>지도 영역</Text>
              <Text style={styles.mapSubText}>다음 일정이 표시됩니다</Text>
            </View>
          </View>
        </View>

        {/* 일정 탭 */}
        {availableDays.length > 0 && (
          <View style={styles.dayTabsContainer}>
            {availableDays.map((dayNumber) => (
              <TouchableOpacity
                key={dayNumber}
                style={[
                  styles.dayTab,
                  selectedDay === dayNumber && styles.dayTabActive,
                ]}
                onPress={() => setSelectedDay(dayNumber)}
              >
                <Text
                  style={[
                    styles.dayTabText,
                    selectedDay === dayNumber && styles.dayTabTextActive,
                  ]}
                >
                  {dayNumber}일차
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 일정 목록 */}
        <View style={styles.itinerarySection}>
          {selectedDay === null ? (
            <View style={styles.emptyItineraryContainer}>
              <Ionicons
                name='calendar-clear-outline'
                size={40}
                color='#9CA3AF'
              />
              <Text style={styles.emptyItineraryTitle}>
                등록된 일정이 없어요
              </Text>
              <Text style={styles.emptyItinerarySubtitle}>
                가이드가 일정을 추가하면 이곳에서 확인할 수 있어요.
              </Text>
            </View>
          ) : (
            (itineraries[selectedDay] || [])
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((item) => (
                <View key={item.id} style={styles.itineraryItem}>
                  <View style={styles.itineraryTime}>
                    <Text style={styles.itineraryTimeText}>
                      {item.startTime.substring(0, 5)}
                    </Text>
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryTitle}>{item.location}</Text>
                    {item.content ? (
                      <Text style={styles.itineraryDescription}>
                        {item.content}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const TravelerSessionRoomScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>세션 ID가 없습니다.</Text>
      </View>
    );
  }

  return (
    <CustomSafeAreaView>
      <SessionDetailsProvider id={id}>
        <TravelerSessionRoomContent />
      </SessionDetailsProvider>
    </CustomSafeAreaView>
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
    marginRight: 12,
  },
  detailButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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
  noticeButton: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF8330',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8130FF',
  },
  noticeButtonText: {
    color: '#FF8330',
  },
  sosButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DC2626',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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
  emptyItineraryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyItineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyItinerarySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default TravelerSessionRoomScreen;
