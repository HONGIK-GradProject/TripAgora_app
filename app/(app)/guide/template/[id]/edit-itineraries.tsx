import GuideItineraryList from '@/components/guide/product/GuideItineraryList';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateItineraries } from '@/services/templates';
import { TemplateItinerary } from '@/types/templates';
import { flattenItineraries } from '@/utils/Itineraries';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EditTemplateItinerariesScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // useTemplateDetails 훅에서 여정 데이터 및 관리 함수들을 가져옵니다.
  const { itineraries, day, deleteItinerary, addItinerary, setDay } =
    useTemplateDetails();

  // 수정/삭제 핸들러를 정의합니다. (추후 수정 모달 등을 띄우는 로직 추가)
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

  const handleDelete = (scheduleId: number) => {
    console.log('Delete item:', scheduleId);
    deleteItinerary(scheduleId);
  };

  const handleAdd = () => {
    const newSchedule: TemplateItinerary = {
      day: day, // 현재 선택된 day에 추가하도록 수정
      title: '',
      content: '',
      startTime: '00:00',
      latitude: 0,
      longitude: 0,
      id: Date.now(), // 임시 ID
    };

    addItinerary(newSchedule);

    // id 충돌을 피하기 위해 newSchedule의 id를 itineraryId로 명시적으로 전달
    const { id: itineraryId, ...restOfSchedule } = newSchedule;
    router.push({
      pathname: '/(app)/guide/template/[id]/edit-itinerary',
      params: {
        id, // URL 경로의 [id]를 채우기 위한 템플릿 ID
        itineraryId: itineraryId.toString(), // 새 아이템의 임시 ID
        ...restOfSchedule,
      },
    });
  };

  const handleSave = async () => {
    try {
      const newItineraries: TemplateItinerary[] = flattenItineraries(itineraries);

      await setTemplateItineraries(+id, newItineraries);
    } catch (error) {
      console.error(error);
    } finally {
      router.back();
    }
  };

  // `itineraries` 객체에서 day 목록을 추출하고 정렬합니다.
  const availableDays = Object.keys(itineraries)
    .map(Number)
    .sort((a, b) => a - b);

  // FlatList의 헤더 컴포넌트
  const ListHeader = (
    <>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name='map' size={40} color='#949494' />
        </View>
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
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정 편집하기</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
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

      <TouchableOpacity style={styles.addScheduleButton} onPress={handleAdd}>
        <Ionicons name='add-circle' size={30} color='#8130FF' />
        <Text style={styles.addScheduleButtonText}>일정 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addScheduleButton: {
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
  addScheduleButtonText: {
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