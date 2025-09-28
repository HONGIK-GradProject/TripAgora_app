import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { TemplateItinerary, TemplateItineraryWithId } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const asdf : TemplateItinerary = {
  day: 0,
  title: '',
  content: '',
  startTime: '',
  latitude: 0,
  longitude: 0
}

type ScheduleParamProps = {
  day: string;
  title: string;
  content: string;
  startTime: string;
  latitude: string;
  longitude: string;
  clientId: string;
  id: string;
}

const AddScheduleItemScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<ScheduleParamProps>();
  const { updateItinerary } = useTemplateDetails();

  // TextInput을 제어하기 위해 state를 사용합니다.
  // useLocalSearchParams에서 받은 값을 초기값으로 설정합니다.
  const [title, setTitle] = React.useState(params.title || '');
  const [day, setDay] = React.useState(params.day || '');
  const [content, setContent] = React.useState(params.content || '');
  const [startTime, setStartTime] = React.useState(params.startTime || '');
  const [latitude, setLatitude] = React.useState(params.latitude || '');
  const [longitude, setLongitude] = React.useState(params.longitude || '');

  const handleEditSchedule = () => {
    // 저장 시에는 state의 현재 값을 사용합니다.
    const newSchedule: TemplateItineraryWithId = {
      day: +day,
      title: title,
      content: content,
      startTime: startTime,
      latitude: +latitude,
      longitude: +longitude,
      clientId: +params.clientId, // clientId는 변경되지 않으므로 params 값을 그대로 사용
    };

    updateItinerary(newSchedule);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 수정</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleEditSchedule}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name='map' size={40} color='#949494' />
            <Text style={styles.mapPlaceholderText}>
              지도가 들어갈 영역 (추후 구현)
            </Text>
          </View>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>장소명 또는 일정명</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder='장소명 또는 일정명을 입력하세요'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Day</Text>
          <TextInput
            value={day}
            onChangeText={setDay}
            placeholder='Day'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
            keyboardType='number-pad'
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>내용 (선택)</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder='설명을 입력하세요'
            placeholderTextColor={'#9A9A9A'}
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical='top'
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>시간</Text>
          <TextInput
            value={startTime}
            onChangeText={setStartTime}
            placeholder='HH:MM 형식으로 입력 (예: 14:30)'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>위도</Text>
          <TextInput
            value={latitude}
            onChangeText={setLatitude}
            placeholder='위도'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
            keyboardType='decimal-pad'
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>경도</Text>
          <TextInput
            value={longitude}
            onChangeText={setLongitude}
            placeholder='경도'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
            keyboardType='decimal-pad'
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFF',
  },
  multiline: {
    minHeight: 100,
  },
});

export default AddScheduleItemScreen;
