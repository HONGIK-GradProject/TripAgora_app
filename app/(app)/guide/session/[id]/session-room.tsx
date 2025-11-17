import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
const SessionRoomContent: React.FC = () => {
  const router = useRouter();
  const { id, roomId: roomIdParam } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();
  const [selectedDay, setSelectedDay] = useState(1);

  // 세션 상세 정보 가져오기
  const sessionDetails = useSessionDetails();
  const {
    title = '',
    startDate = '',
    endDate = '',
    roomId: roomIdFromDetails,
    itineraries = {},
    isLoading = true,
  } = sessionDetails || {};

  // 쿼리 파라미터의 roomId를 우선 사용, 없으면 상세 조회에서 받아온 roomId 사용
  const roomId = roomIdParam ? parseInt(roomIdParam) : roomIdFromDetails;

  // 일정 관련 상태
  const availableDays = useMemo(
    () =>
      Object.keys(itineraries)
        .map(Number)
        .sort((a, b) => a - b),
    [itineraries]
  );

  const selectedDayItineraries = useMemo(() => {
    const dayList = itineraries[selectedDay] || [];
    return [...dayList].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [itineraries, selectedDay]);

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

  // 공지하기 기능
  const handleAnnounce = () => {
    if (roomId) {
      router.push(`/guide/session/${id}/announce?roomId=${roomId}` as any);
    }
  };

  // 일정 편집 기능
  const handleEditItinerary = () => {
    console.log('일정 편집');
  };

  // 로딩 중일 때
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      {/* 헤더 섹션 */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            router.push(`/guide/session/${id}` as any);
          }}
        >
          <Ionicons
            name='information-circle-outline'
            size={24}
            color='#000'
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>현재 진행 중</Text>
          <Text style={styles.summaryTitle}>{title || '여행 일정'}</Text>
          <Text style={styles.summaryDates}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleEditItinerary}
          >
            <Text style={styles.outlineButtonText}>일정 편집하기</Text>
          </TouchableOpacity>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleCheckLocations}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIcon, styles.actionIconPrimary]}>
              <Ionicons name='location' size={20} color='#5B67F5' />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>일행 확인하기</Text>
              <Text style={styles.actionSubtitle}>
                참여자들의 현재 위치를 확인하세요
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.actionCardSecondary,
              !roomId && styles.actionCardDisabled,
            ]}
            onPress={handleAnnounce}
            disabled={!roomId}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIcon, styles.actionIconSecondary]}>
              <Ionicons name='notifications' size={20} color='#5B67F5' />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>공지하기</Text>
              <Text style={styles.actionSubtitle}>
                일행에게 공지를 발송할 수 있어요
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
          </TouchableOpacity>
        </View>

        {/* 지도 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>다음 일정 미리보기</Text>
            <Text style={styles.sectionSubtitle}>지도 연동 준비 중</Text>
          </View>
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
          <View style={styles.dayTabsWrapper}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>일정 보기</Text>
              <Text style={styles.sectionSubtitle}>
                {`총 ${selectedDayItineraries.length}개의 일정`}
              </Text>
            </View>
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
          </View>
        )}

        {/* 일정 목록 */}
        <View style={styles.itinerarySection}>
          {selectedDayItineraries.length > 0 ? (
            selectedDayItineraries.map((item) => (
              <View key={item.id} style={styles.itineraryCard}>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>
                    {item.startTime.substring(0, 5)}
                  </Text>
                </View>
                <View style={styles.itineraryInfo}>
                  <Text style={styles.itineraryTitle}>{item.location}</Text>
                  {item.content ? (
                    <Text style={styles.itineraryDescription}>
                      {item.content}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyItinerary}>
              <Ionicons name='calendar-outline' size={28} color='#9CA3AF' />
              <Text style={styles.emptyItineraryText}>
                등록된 일정이 없습니다.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const SessionRoomScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>여행 ID가 없습니다.</Text>
      </View>
    );
  }

  return (
    <CustomSafeAreaView>
      <SessionDetailsProvider id={id}>
        <SessionRoomContent />
      </SessionDetailsProvider>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 80,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  headerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  detailButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
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
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B67F5',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryDates: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#C5CCFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B67F5',
  },
  actionsGrid: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  actionCardSecondary: {
    borderColor: '#F3E8FF',
    backgroundColor: '#FBF8FF',
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconPrimary: {
    backgroundColor: '#E6E9FF',
  },
  actionIconSecondary: {
    backgroundColor: '#F1ECFF',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  dayTabsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C5CCFF',
    backgroundColor: '#fff',
  },
  dayTabActive: {
    backgroundColor: '#5B67F5',
    borderColor: '#5B67F5',
  },
  dayTabText: {
    fontSize: 16,
    color: '#5B67F5',
    fontWeight: '400',
  },
  dayTabTextActive: {
    color: '#fff',
  },
  itinerarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  itineraryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  timeBadge: {
    width: 72,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#E6E9FF',
    alignItems: 'center',
  },
  timeBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5B67F5',
  },
  itineraryInfo: {
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
  emptyItinerary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyItineraryText: {
    fontSize: 14,
    color: '#6B7280',
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

export default SessionRoomScreen;
