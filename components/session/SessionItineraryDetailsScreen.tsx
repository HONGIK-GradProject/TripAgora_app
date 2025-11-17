import CustomSafeAreaView from '@/components/CustomSafeAreaView';
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
import { useFocusEffect, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 세션 일정 상세보기 화면 컴포넌트
 * SessionDetailsProvider로 감싸져 있어야 합니다.
 */
export const SessionItineraryDetailsContent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { itineraries, isLoading, refetch } = useSessionDetails();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(
    null
  );
  const [mapKey, setMapKey] = useState(0);
  const mapViewRef = useRef<InteractiveMapViewRef>(null);

  const availableDays = useMemo(() => {
    return Object.keys(itineraries)
      .map(Number)
      .sort((a, b) => a - b);
  }, [itineraries]);

  useEffect(() => {
    if (availableDays.length === 0) {
      setSelectedDay(1);
      return;
    }

    if (!availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      setMapKey((prev) => prev + 1);
    }, [refetch])
  );

  const dayItineraries: SessionItinerary[] = useMemo(() => {
    const list = itineraries[selectedDay] || [];
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [itineraries, selectedDay]);

  const clusterMarkers: ClusterMarkerProp[] = useMemo(() => {
    return dayItineraries.map((itinerary, index) => {
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
  }, [dayItineraries, selectedItineraryId]);

  const cameraPosition = useMemo(
    () => ({
      latitude: 37.5665,
      longitude: 126.978,
      zoom: 10,
    }),
    []
  );

  useEffect(() => {
    if (dayItineraries.length === 0) {
      mapViewRef.current?.animateCameraTo({
        latitude: 37.551567,
        longitude: 126.925168,
        zoom: 16,
        easing: 'EaseIn',
      });
      return;
    }

    if (dayItineraries.length === 1) {
      const itinerary = dayItineraries[0];
      mapViewRef.current?.animateCameraTo({
        latitude: itinerary.latitude,
        longitude: itinerary.longitude,
        zoom: 16,
        easing: 'EaseIn',
      });
      return;
    }

    const boundary = dayItineraries.reduce(
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
  }, [dayItineraries, mapKey]);

  const handleMarkerClick = (markerIdentifier: string) => {
    const clickedId = parseInt(markerIdentifier, 10);
    if (!Number.isNaN(clickedId)) {
      setSelectedItineraryId(clickedId);
    }
  };

  const handleItemPress = (item: SessionItinerary) => {
    setSelectedItineraryId(item.id);
    if (item.latitude && item.longitude) {
      mapViewRef.current?.animateCameraTo({
        latitude: item.latitude,
        longitude: item.longitude,
        zoom: 16,
        duration: 500,
        easing: 'EaseOut',
      });
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <CustomSafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 상세보기</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <View style={styles.mapContainer} key={mapKey}>
          <InteractiveMapView
            ref={mapViewRef}
            cameraPosition={cameraPosition}
            clusterMarkers={clusterMarkers}
            options={{
              drawPath: true,
            }}
            onMarkerClick={handleMarkerClick}
          />
        </View>

        {availableDays.length > 0 ? (
          <>
            <View style={styles.daySelectionContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daySelection}
              >
                {availableDays.map((dayNumber) => (
                  <TouchableOpacity
                    key={dayNumber}
                    style={[
                      styles.dayButton,
                      selectedDay === dayNumber && styles.dayButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedDay(dayNumber);
                      setSelectedItineraryId(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDay === dayNumber && styles.dayButtonTextActive,
                      ]}
                    >
                      {dayNumber}일차
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.listTitle}>상세 일정</Text>

            {dayItineraries.length > 0 ? (
              <View style={styles.itineraryList}>
                {dayItineraries.map((item) => {
                  const isSelected = item.id === selectedItineraryId;
                  return (
                    <View key={item.id} style={styles.itineraryItem}>
                      <View style={styles.itineraryTimeBadge}>
                        <Text style={styles.itineraryTimeText}>
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
                        <Text style={styles.itineraryTitle}>
                          {item.location}
                        </Text>
                        {item.content ? (
                          <Text style={styles.itineraryContent}>
                            {item.content}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name='calendar-outline' size={32} color='#9CA3AF' />
                <Text style={styles.emptyStateText}>
                  선택한 일차에 등록된 일정이 없습니다.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name='calendar-outline' size={32} color='#9CA3AF' />
            <Text style={styles.emptyStateText}>등록된 일정이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerPlaceholder: {
    width: 40,
  },
  contentContainer: {
    flexGrow: 1,
  },
  mapContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#D9D9D9',
  },
  daySelectionContainer: {
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  daySelection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginRight: 12,
  },
  dayButtonActive: {
    backgroundColor: '#5B67F5',
    borderColor: '#5B67F5',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#5B67F5',
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  itineraryList: {
    paddingHorizontal: 20,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itineraryTimeBadge: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itineraryTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B67F5',
    backgroundColor: '#E6E9FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  itineraryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
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
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  itineraryContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
});
