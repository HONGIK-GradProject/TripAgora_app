import {
  InteractiveMapView,
  InteractiveMapViewRef,
} from '@/components/map/InteractiveMapView';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { SessionItinerary } from '@/types/sessions';
import { Ionicons } from '@expo/vector-icons';
import type {
  ClusterMarkerProp,
  MarkerSymbol,
} from '@mj-studio/react-native-naver-map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type SessionRoomUserType = 'guide' | 'traveler';

interface SessionRoomContentProps {
  userType: SessionRoomUserType;
}

type UpcomingItinerary = {
  dayNumber: number;
  itinerary: SessionItinerary;
  timestamp: number;
};

const SessionRoomContent: React.FC<SessionRoomContentProps> = ({
  userType,
}) => {
  const router = useRouter();
  const { id, roomId: roomIdParam } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  const isGuide = userType === 'guide';

  const sessionDetails = useSessionDetails();
  const {
    title = '',
    startDate = '',
    endDate = '',
    maxParticipants = 0,
    currentParticipants = 0,
    roomId: roomIdFromDetails,
    itineraries = {},
    isLoading = true,
  } = sessionDetails || {};

  const roomId = roomIdParam ? parseInt(roomIdParam) : roomIdFromDetails;

  const availableDays = useMemo(
    () =>
      Object.keys(itineraries)
        .map(Number)
        .sort((a, b) => a - b),
    [itineraries]
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(
    availableDays.length > 0 ? availableDays[0] : null
  );
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(
    null
  );
  const [mapKey, setMapKey] = useState(0);
  const mapViewRef = useRef<InteractiveMapViewRef>(null);
  const autoFocusInitializedRef = useRef(false);

  const focusItineraryOnMap = useCallback((itinerary?: SessionItinerary) => {
    if (!itinerary?.latitude || !itinerary?.longitude) return;

    mapViewRef.current?.animateCameraTo({
      latitude: itinerary.latitude,
      longitude: itinerary.longitude,
      zoom: 16,
      duration: 500,
      easing: 'EaseOut',
    });
  }, []);

  const getItineraryDateTime = useCallback(
    (dayNumber: number, time?: string) => {
      if (!startDate || !time) return null;
      const baseDate = new Date(startDate);
      if (Number.isNaN(baseDate.getTime())) return null;

      const [hourStr, minuteStr] = time.split(':');
      if (hourStr === undefined || minuteStr === undefined) return null;
      const hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + (dayNumber - 1));
      date.setHours(hours, minutes, 0, 0);
      return date;
    },
    [startDate]
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

  useEffect(() => {
    setSelectedItineraryId(null);
    setMapKey((prev) => prev + 1);
  }, [selectedDay]);

  useEffect(() => {
    if (autoFocusInitializedRef.current) return;
    if (!startDate || availableDays.length === 0) return;

    const now = new Date();

    let upcoming: UpcomingItinerary | null = null;

    availableDays.forEach((dayNumber) => {
      const sortedItineraries = [...(itineraries[dayNumber] || [])].sort(
        (a, b) => a.startTime.localeCompare(b.startTime)
      );

      sortedItineraries.forEach((itinerary) => {
        const itineraryDate = getItineraryDateTime(
          dayNumber,
          itinerary.startTime
        );
        if (!itineraryDate) return;
        const timestamp = itineraryDate.getTime();
        if (timestamp < now.getTime()) return;

        if (!upcoming || timestamp < upcoming.timestamp) {
          upcoming = { dayNumber, itinerary, timestamp };
        }
      });
    });

    if (upcoming !== null) {
      const upcomingItinerary = upcoming as UpcomingItinerary;
      setSelectedDay(upcomingItinerary.dayNumber);
      setSelectedItineraryId(upcomingItinerary.itinerary.id);
      autoFocusInitializedRef.current = true;
      return;
    }

    const fallbackDay = availableDays[0];
    const fallbackItineraries = [...(itineraries[fallbackDay] || [])].sort(
      (a, b) => a.startTime.localeCompare(b.startTime)
    );

    if (fallbackItineraries.length > 0) {
      setSelectedDay(fallbackDay);
      setSelectedItineraryId(fallbackItineraries[0].id);
    }

    autoFocusInitializedRef.current = true;
  }, [availableDays, itineraries, startDate, getItineraryDateTime]);

  const selectedDayItineraries = useMemo(() => {
    if (selectedDay === null) {
      return [];
    }
    const dayList = itineraries[selectedDay] || [];
    return [...dayList].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [itineraries, selectedDay]);

  useEffect(() => {
    if (selectedItineraryId == null) return;
    const itinerary = selectedDayItineraries.find(
      (item) => item.id === selectedItineraryId
    );
    if (itinerary) {
      focusItineraryOnMap(itinerary);
    }
  }, [selectedItineraryId, selectedDayItineraries, focusItineraryOnMap]);

  // 지도 마커 생성
  const clusterMarkers: ClusterMarkerProp[] = useMemo(() => {
    return selectedDayItineraries.map((itinerary, index) => {
      const isSelected = itinerary.id === selectedItineraryId;
      return {
        identifier: itinerary.id.toString(),
        latitude: itinerary.latitude,
        longitude: itinerary.longitude,
        image: {
          symbol: (isSelected ? 'red' : 'blue') as MarkerSymbol,
          size: isSelected ? 24 : 20,
        },
        caption: (index + 1).toString(),
        captionSize: 12,
        captionColor: '#FFFFFF',
      };
    });
  }, [selectedDayItineraries, selectedItineraryId]);

  // 카메라 초기 위치
  const cameraPosition = useMemo(
    () => ({
      latitude: 37.5665,
      longitude: 126.978,
      zoom: 10,
    }),
    []
  );

  // 지도 카메라 자동 조정
  useEffect(() => {
    if (selectedDayItineraries.length === 0) {
      mapViewRef.current?.animateCameraTo({
        latitude: 37.551567,
        longitude: 126.925168,
        zoom: 16,
        easing: 'EaseIn',
      });
      return;
    }

    if (selectedDayItineraries.length === 1) {
      const itinerary = selectedDayItineraries[0];
      mapViewRef.current?.animateCameraTo({
        latitude: itinerary.latitude,
        longitude: itinerary.longitude,
        zoom: 16,
        easing: 'EaseIn',
      });
      return;
    }

    const boundary = selectedDayItineraries.reduce(
      (prev, cur) => ({
        minLat: Math.min(prev.minLat, cur.latitude),
        maxLat: Math.max(prev.maxLat, cur.latitude),
        minLng: Math.min(prev.minLng, cur.longitude),
        maxLng: Math.max(prev.maxLng, cur.longitude),
      }),
      {
        minLat: Infinity,
        maxLat: -Infinity,
        minLng: Infinity,
        maxLng: -Infinity,
      }
    );

    const padFactor = 0.4;
    const latDelta = boundary.maxLat - boundary.minLat;
    const lngDelta = boundary.maxLng - boundary.minLng;
    const latPadding = latDelta * padFactor;
    const lngPadding = lngDelta * padFactor;

    const camera = {
      latitude: boundary.minLat - latPadding / 2,
      longitude: boundary.minLng - lngPadding / 2,
      latitudeDelta: latDelta + latPadding,
      longitudeDelta: lngDelta + lngPadding,
    };

    mapViewRef.current?.animateRegionTo({
      ...camera,
      easing: 'EaseIn',
    });
  }, [selectedDayItineraries, mapKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleCheckLocations = () => {
    console.log('일행 확인하기');
  };

  const handleAnnounce = () => {
    if (roomId) {
      router.push(
        `/guide/session/${id}/announce?roomId=${roomId.toString()}` as any
      );
    }
  };

  const handleEditItinerary = () => {
    console.log('일정 편집');
  };

  const handleNoticeList = () => {
    if (!roomId) return;
    router.push(
      `/traveler/trip/${id}/notice?roomId=${roomId.toString()}` as any
    );
  };

  const handleSendSOS = () => {
    Alert.alert('SOS 보내기', '긴급 상황을 일행에게 알리시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '보내기',
        style: 'destructive',
        onPress: () => console.log('SOS 보내기'),
      },
    ]);
  };

  const handleGoToDetail = () => {
    if (!id) return;
    if (isGuide) {
      router.push(`/guide/session/${id}` as any);
    } else {
      router.push(`/traveler/trip/${id}` as any);
    }
  };

  // 마커 클릭 핸들러
  const handleMarkerClick = (markerIdentifier: string) => {
    const clickedId = parseInt(markerIdentifier, 10);
    if (!Number.isNaN(clickedId)) {
      setSelectedItineraryId(clickedId);
    }
  };

  // 일정 항목 클릭 핸들러 (지도 포커스)
  const handleItemPress = (item: SessionItinerary) => {
    setSelectedItineraryId(item.id);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const summaryMeta = !isGuide
    ? `${currentParticipants}/${maxParticipants}명 참여 중`
    : undefined;

  const actionCards = isGuide
    ? [
        {
          title: '일행 확인하기',
          subtitle: '참여자들의 현재 위치를 확인하세요',
          icon: 'location' as const,
          disabled: false,
          onPress: handleCheckLocations,
          variant: 'primary' as const,
        },
        {
          title: '공지하기',
          subtitle: '일행에게 공지를 발송할 수 있어요',
          icon: 'notifications' as const,
          disabled: !roomId,
          onPress: handleAnnounce,
          variant: 'secondary' as const,
        },
      ]
    : [
        {
          title: '일행 확인하기',
          subtitle: '참여자들의 현재 위치를 확인하세요',
          icon: 'location' as const,
          disabled: false,
          onPress: handleCheckLocations,
          variant: 'primary' as const,
        },
        {
          title: '공지 목록',
          subtitle: '가이드가 보낸 공지를 확인하세요',
          icon: 'megaphone' as const,
          disabled: !roomId,
          onPress: handleNoticeList,
          variant: 'secondary' as const,
        },
      ];

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={handleGoToDetail}
        >
          <Ionicons name='information-circle-outline' size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {isGuide ? '현재 진행 중' : '나의 여행'}
          </Text>
          <Text style={styles.summaryTitle}>{title || '여행 일정'}</Text>
          <Text style={styles.summaryDates}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
          {summaryMeta && <Text style={styles.summaryMeta}>{summaryMeta}</Text>}
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={isGuide ? handleEditItinerary : handleGoToDetail}
          >
            <Text style={styles.outlineButtonText}>
              {isGuide ? '일정 편집하기' : '여행 상세 보기'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsGrid}>
          {actionCards.map((card, index) => (
            <TouchableOpacity
              key={card.title}
              style={[
                styles.actionCard,
                card.variant === 'secondary' && styles.actionCardSecondary,
                card.disabled && styles.actionCardDisabled,
              ]}
              onPress={card.onPress}
              disabled={card.disabled}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.actionIcon,
                  card.variant === 'secondary'
                    ? styles.actionIconSecondary
                    : styles.actionIconPrimary,
                ]}
              >
                <Ionicons name={card.icon} size={20} color='#5B67F5' />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{card.title}</Text>
                <Text style={styles.actionSubtitle}>{card.subtitle}</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          ))}
        </View>

        {!isGuide && (
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
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>다음 일정 미리보기</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedDayItineraries.length > 0
                ? `${selectedDayItineraries.length}개의 일정`
                : '일정 없음'}
            </Text>
          </View>
          <View style={styles.mapContainer} key={mapKey}>
            {selectedDayItineraries.length > 0 ? (
              <InteractiveMapView
                ref={mapViewRef}
                cameraPosition={cameraPosition}
                clusterMarkers={clusterMarkers}
                options={{
                  drawPath: true,
                }}
                onMarkerClick={handleMarkerClick}
              />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Ionicons name='map' size={48} color='#9CA3AF' />
                <Text style={styles.mapPlaceholderText}>지도 영역</Text>
                <Text style={styles.mapSubText}>일정이 없습니다</Text>
              </View>
            )}
          </View>
        </View>

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

        <View style={styles.itinerarySection}>
          {selectedDayItineraries.length > 0 ? (
            selectedDayItineraries.map((item) => {
              const isSelected = item.id === selectedItineraryId;
              return (
                <View key={item.id} style={styles.itineraryItem}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>
                      {item.startTime.substring(0, 5)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.itineraryCard,
                      isSelected && styles.itineraryCardSelected,
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.itineraryTitle}>{item.location}</Text>
                    {item.content ? (
                      <Text style={styles.itineraryDescription}>
                        {item.content}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyItinerary}>
              <Ionicons name='calendar-outline' size={28} color='#9CA3AF' />
              <Text style={styles.emptyItineraryText}>
                등록된 일정이 없습니다.
              </Text>
              {!isGuide && (
                <Text style={styles.emptyItinerarySubtext}>
                  가이드가 일정을 추가하면 이곳에서 확인할 수 있어요.
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
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
    paddingBottom: 100,
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
    marginBottom: 4,
  },
  summaryMeta: {
    fontSize: 14,
    color: '#4B5563',
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
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  itineraryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itineraryCardSelected: {
    borderColor: '#5B67F5',
    shadowOpacity: 0.15,
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
  emptyItinerarySubtext: {
    fontSize: 13,
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

export default SessionRoomContent;
