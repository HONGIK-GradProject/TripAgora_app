import GuideItineraryList from '@/components/guide/product/GuideItineraryList';
import { InteractiveMapView } from '@/components/map/InteractiveMapView';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateItineraries } from '@/services/templates';
import { TemplateItinerary } from '@/types/templates';
import { flattenItineraries } from '@/utils/Itineraries';
import { Ionicons } from '@expo/vector-icons';
import { ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * 여행 템플릿의 상세 일정 목록을 편집하는 화면입니다.
 * 일정을 추가, 수정, 삭제하고 전체 변경사항을 저장할 수 있습니다.
 */
const EditTemplateItinerariesScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // useTemplateDetails 훅에서 여정 데이터 및 관리 함수들을 가져옵니다.
  const { itineraries, day, deleteItinerary, addItinerary, setDay } =
    useTemplateDetails();

  useFocusEffect(
    useCallback(() => {
      // 화면이 포커스될 때마다 mapKey를 변경하여 지도를 강제로 다시 렌더링합니다.
      setMapKey((prevKey) => prevKey + 1);
    }, [])
  );

  /**
   * 선택된 일정 항목의 편집 화면으로 이동합니다.
   * @param item - 수정할 일정 항목 객체
   */
  const handleUpdate = (item: TemplateItinerary) => {
    // id 충돌을 피하기 위해 item의 id를 itineraryId로 명시적으로 전달
    const { id: itineraryId, ...restOfItem } = item;
    router.push({
      pathname: '/(app)/guide/template/[id]/edit-itinerary',
      params: {
        id, // URL 경로의 [id]를 채우기 위한 템플릿 ID
        itineraryId: itineraryId.toString(), // 수정할 아이템의 ID
        ...restOfItem, // 나머지 아이템 정보
      },
    });
  };

  /**
   * 선택된 일정 항목을 로컬 상태에서 삭제합니다.
   * @param itineraryId - 삭제할 일정 항목의 ID
   */
  const handleDelete = (itineraryId: number) => {
    console.log('Delete item:', itineraryId);
    deleteItinerary(itineraryId);
  };

  /**
   * 새로운 빈 일정 항목을 로컬 상태에 추가하고, 해당 항목의 편집 화면으로 즉시 이동합니다.
   */
  const handleAdd = () => {
    const newItinerary: TemplateItinerary = {
      day: day, // 현재 선택된 day에 추가하도록 수정
      title: '',
      content: '',
      startTime: '00:00',
      latitude: 0,
      longitude: 0,
      id: Date.now(), // 임시 ID
    };

    addItinerary(newItinerary);

    // id 충돌을 피하기 위해 newItinerary의 id를 itineraryId로 명시적으로 전달
    const { id: itineraryId, ...rest } = newItinerary;
    router.push({
      pathname: '/(app)/guide/template/[id]/edit-itinerary',
      params: {
        id, // URL 경로의 [id]를 채우기 위한 템플릿 ID
        itineraryId: itineraryId.toString(), // 새 아이템의 임시 ID
        ...rest,
      },
    });
  };

  /**
   * 현재까지의 모든 일정 변경사항(추가, 수정, 삭제)을 서버에 일괄 저장합니다.
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newItineraries: TemplateItinerary[] =
        flattenItineraries(itineraries);

      const result = await setTemplateItineraries(+id, newItineraries);

      if (result?.success) {
        Toast.show({
          type: 'success',
          text1: '일정이 성공적으로 저장되었습니다.',
        });
        router.back();
      } else {
        // 에러가 발생한 경우 - 이전 화면으로 돌아가지 않음
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

  // `itineraries` 객체에서 day 목록을 추출하고 정렬합니다.
  const availableDays = Object.keys(itineraries)
    .map(Number)
    .sort((a, b) => a - b);

  const clusterMarkers: ClusterMarkerProp[] = useMemo(() => {
    const allItineraries = itineraries[day];
    if (!allItineraries) {
      return [];
    }

    return allItineraries.map((itinerary) => ({
      identifier: itinerary.id.toString(),
      latitude: itinerary.latitude,
      longitude: itinerary.longitude,
      image: { symbol: 'blue' },
    }));
  }, [itineraries, day]);

  const cameraPosition = useMemo(
    () => ({
      latitude: 37.5665,
      longitude: 126.978,
      zoom: 10,
    }),
    []
  );

  // FlatList의 헤더 컴포넌트
  const ListHeader = (
    <>
      <View style={styles.mapContainer} key={mapKey}>
        <InteractiveMapView
          cameraPosition={cameraPosition}
          clusterMarkers={clusterMarkers}
          options={{
            currentLocationButton: true,
          }}
        />
      </View>

      <View style={styles.daySelection}>
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
      </View>
      <Text style={styles.listTitle}>상세 일정</Text>
    </>
  );

  return (
    <View style={styles.container}>
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
            <ActivityIndicator color='#8130FF' />
          ) : (
            <Text style={styles.saveButtonText}>저장</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 선택된 날짜(day)에 해당하는 일정을 표시합니다. */}
      {/* 데이터가 없는 경우를 대비해 '|| []'를 추가하여 안정성을 높입니다. */}
      <GuideItineraryList
        itineraries={itineraries[day] || []}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollViewContent}
      />

      <TouchableOpacity style={styles.addItineraryButton} onPress={handleAdd}>
        <Ionicons name='add-circle' size={30} color='#8130FF' />
        <Text style={styles.addItineraryButtonText}>일정 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addItineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 20,
  },
  addItineraryButtonText: {
    fontSize: 16,
    color: '#8130FF',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // 배경색 변경
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8130FF',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    color: '#6B6B6B',
  },
  daySelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dayButtonActive: {
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#8130FF',
  },
  dayButtonTextActive: {
    fontSize: 16,
    color: '#fff',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
});

export default EditTemplateItinerariesScreen;
