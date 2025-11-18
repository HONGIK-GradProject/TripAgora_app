import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import GuideItineraryList from '@/components/guide/template/GuideItineraryList';
import {
  InteractiveMapView,
  InteractiveMapViewRef,
} from '@/components/map/InteractiveMapView';
import { Colors } from '@/constants/Colors';
import { useSessionItineraryEditor } from '@/hooks/sessions/useSessionItineraryEditor';
import { setSessionItineraries } from '@/services/sessions';
import { TemplateItinerary } from '@/types/templates';
import { flattenItineraries } from '@/utils/Itineraries';
import { Ionicons } from '@expo/vector-icons';
import {
  CameraAnimationEasing,
  ClusterMarkerProp,
} from '@mj-studio/react-native-naver-map';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EditSessionItinerariesScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const mapViewRef = useRef<InteractiveMapViewRef>(null);
  const initialItinerariesSnapshotRef = useRef<string | null>(null);
  const allowNavigationRef = useRef(false);
  const insets = useSafeAreaInsets();

  const {
    itineraries,
    day,
    deleteItinerary,
    addItinerary,
    setDay,
    isLoading,
    addDay: appendDay,
  } = useSessionItineraryEditor();

  useEffect(() => {
    handleCameraMove();
  }, [day, mapKey]);

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [day]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowNavigationRef.current || !hasUnsavedChanges || isSaving) {
        return;
      }

      event.preventDefault();

      Alert.alert(
        '저장되지 않은 변경 사항',
        '변경 내용을 저장하지 않고 나가시겠어요?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '나가기',
            style: 'destructive',
            onPress: () => {
              allowNavigationRef.current = true;
              navigation.dispatch(event.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges, isSaving]);

  const handleCameraMove = () => {
    if (!itineraries[day] || itineraries[day].length === 0) {
      mapViewRef.current?.animateCameraTo({
        latitude: 37.551567,
        longitude: 126.925168,
        zoom: 16,
        easing: 'EaseIn',
      });

      return;
    }

    if (itineraries[day].length === 1) {
      const firstItinerary = itineraries[day][0];
      mapViewRef.current?.animateCameraTo({
        latitude: firstItinerary.latitude,
        longitude: firstItinerary.longitude,
        zoom: 16,
        easing: 'EaseIn',
      });

      return;
    }

    const boundary = itineraries[day].reduce(
      (prev, cur) => {
        return {
          minLat: Math.min(prev.minLat, cur.latitude),
          maxLat: Math.max(prev.maxLat, cur.latitude),
          minLng: Math.min(prev.minLng, cur.longitude),
          maxLng: Math.max(prev.maxLng, cur.longitude),
        };
      },
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
      easing: 'EaseIn' as CameraAnimationEasing,
    };

    mapViewRef.current?.animateRegionTo(camera);
  };

  const handleMarkerClick = (markerIdentifier: string) => {
    const clickedId = parseInt(markerIdentifier, 10);
    if (!isNaN(clickedId)) {
      setSelectedItineraryId(clickedId);
    }
  };

  const serializeItineraries = useCallback(
    (data: Record<number, TemplateItinerary[]>) => {
      const days = Object.keys(data)
        .map(Number)
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);

      const flattened = flattenItineraries(data)
        .map((item) => ({
          ...item,
          startTime: item.startTime ?? '',
        }))
        .sort((a, b) => {
          if (a.day !== b.day) {
            return a.day - b.day;
          }
          const timeComparison = a.startTime.localeCompare(b.startTime);
          if (timeComparison !== 0) {
            return timeComparison;
          }
          return (a.id ?? 0) - (b.id ?? 0);
        });

      return JSON.stringify({ days, items: flattened });
    },
    []
  );

  const serializedCurrentItineraries = useMemo(
    () => serializeItineraries(itineraries),
    [itineraries, serializeItineraries]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (initialItinerariesSnapshotRef.current === null) {
      initialItinerariesSnapshotRef.current = serializedCurrentItineraries;
      setHasUnsavedChanges(false);
      return;
    }

    setHasUnsavedChanges(
      initialItinerariesSnapshotRef.current !== serializedCurrentItineraries
    );
  }, [isLoading, serializedCurrentItineraries]);

  const handleUpdate = (item: TemplateItinerary) => {
    const { id: itineraryId, ...restOfItem } = item;
    router.push({
      pathname: '/guide/session/[id]/edit-itinerary',
      params: {
        id,
        itineraryId: itineraryId.toString(),
        ...restOfItem,
      },
    });
  };

  const handleDelete = (itineraryId: number) => {
    deleteItinerary(itineraryId);
  };

  const handleItemPress = (item: TemplateItinerary) => {
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

  const handleAdd = () => {
    const newItinerary: TemplateItinerary = {
      day: day,
      location: '서울시청',
      content: '',
      startTime: '00:00',
      latitude: 37.5665,
      longitude: 126.978,
      id: Date.now(),
    };

    addItinerary(newItinerary);

    const { id: itineraryId, ...rest } = newItinerary;
    router.push({
      pathname: '/guide/session/[id]/edit-itinerary',
      params: {
        id,
        itineraryId: itineraryId.toString(),
        ...rest,
      },
    });
  };

  const handleAddDay = () => {
    appendDay();
    setSelectedItineraryId(null);
  };

  const handleSave = async () => {
    if (!id) {
      return;
    }
    setIsSaving(true);
    try {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new Error('세션 ID가 올바르지 않습니다.');
      }

      const newItineraries: TemplateItinerary[] =
        flattenItineraries(itineraries);

      const result = await setSessionItineraries(
        numericId,
        newItineraries.map(({ id: _, ...rest }) => rest)
      );

      if (result?.success) {
        initialItinerariesSnapshotRef.current =
          serializeItineraries(itineraries);
        setHasUnsavedChanges(false);
        allowNavigationRef.current = true;
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: '일정 저장 실패',
          text2: result?.error || '일정 저장 중 오류가 발생했습니다.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: '일정 저장 실패',
        text2: '일정 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const availableDays = Object.keys(itineraries)
    .map(Number)
    .sort((a, b) => a - b);

  const clusterMarkers: ClusterMarkerProp[] = useMemo(() => {
    const allItineraries = itineraries[day];
    if (!allItineraries) {
      return [];
    }

    const sortedItineraries = [...allItineraries].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    return sortedItineraries.map((itinerary, index) => {
      const isSelected = itinerary.id === selectedItineraryId;
      return {
        identifier: itinerary.id.toString(),
        latitude: itinerary.latitude,
        longitude: itinerary.longitude,
        image: {
          symbol: isSelected ? 'red' : 'blue',
          size: isSelected ? 24 : 20,
        },
        caption: (index + 1).toString(),
        captionSize: 12,
        captionColor: '#FFFFFF',
      };
    });
  }, [itineraries, day, selectedItineraryId]);

  const cameraPosition = useMemo(
    () => ({
      latitude: 37.5665,
      longitude: 126.978,
      zoom: 10,
    }),
    []
  );

  const ListHeader = (
    <>
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
                day === dayNumber && styles.dayButtonActive,
              ]}
              onPress={() => setDay(dayNumber)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  day === dayNumber && styles.dayButtonTextActive,
                ]}
              >
                {dayNumber}일차
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.dayButton, styles.addDayButton]}
            onPress={handleAddDay}
          >
            <Ionicons name='add' size={16} color='#5B67F5' />
            <Text style={styles.addDayButtonText}>일차 추가</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Text style={styles.listTitle}>상세 일정</Text>
    </>
  );

  return (
    <CustomSafeAreaView style={{ paddingBottom: insets.bottom }}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isSaving}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>여행 일정 편집하기</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color='#5B67F5' />
            ) : (
              <Text style={styles.saveButtonText}>저장</Text>
            )}
          </TouchableOpacity>
        </View>

        <GuideItineraryList
          itineraries={itineraries[day] || []}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onItemPress={handleItemPress}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.scrollViewContent}
          selectedItineraryId={selectedItineraryId}
        />

        <View style={[styles.addButtonContainer]}>
          <TouchableOpacity
            style={styles.addItineraryButton}
            onPress={handleAdd}
          >
            <Ionicons name='add-circle' size={24} color='#fff' />
            <Text style={styles.addItineraryButtonText}>일정 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  addItineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B67F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  addItineraryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B67F5',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelectionContainer: {
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  daySelection: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginRight: 12,
  },
  addDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#5B67F5',
    borderStyle: 'dashed',
  },
  addDayButtonText: {
    fontSize: 16,
    color: '#5B67F5',
    fontWeight: '600',
    marginLeft: 6,
  },
  dayButtonActive: {
    backgroundColor: '#5B67F5',
    borderColor: '#5B67F5',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#5B67F5',
  },
  dayButtonTextActive: {
    fontSize: 16,
    color: '#fff',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default EditSessionItinerariesScreen;
