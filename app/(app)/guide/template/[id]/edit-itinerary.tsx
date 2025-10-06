import { InteractiveMapView } from '@/components/map/InteractiveMapView';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { TemplateItinerary } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type ItineraryParamProps = {
  day: string;
  title: string;
  content: string;
  startTime: string;
  latitude: string;
  longitude: string;
  itineraryId: string;
};

const EditTemplateItineraryScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<ItineraryParamProps>();
  const { updateItinerary, setDay } = useTemplateDetails();

  const [title, setTitle] = useState(params.title || '');
  const [localDay, setLocalDay] = useState(params.day || '');
  const [content, setContent] = useState(params.content || '');
  const [startTime, setStartTime] = useState(params.startTime || '09:00');
  const [latitude, setLatitude] = useState(params.latitude || '37.5665');
  const [longitude, setLongitude] = useState(params.longitude || '126.9780');

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const parseStartTime = (timeStr: string) => {
    if (!timeStr) {
      const d = new Date();
      d.setHours(9);
      d.setMinutes(0);
      return d;
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    if (!isNaN(hours) && !isNaN(minutes)) {
      date.setHours(hours);
      date.setMinutes(minutes);
    }
    return date;
  };

  const [date, setDate] = useState(parseStartTime(params.startTime));
  const [showPicker, setShowPicker] = useState(false);

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}`);
    }
  };

  const handleEditSchedule = () => {
    if (!localDay || !title || !startTime || !latitude || !longitude) {
      Toast.show({
        type: 'error',
        text1: '모든 필드를 채워주세요.',
        position: 'bottom',
        bottomOffset: 100,
      });
      return;
    }
    const newSchedule: TemplateItinerary = {
      id: +params.itineraryId,
      day: +localDay,
      title: title,
      content: content,
      startTime: startTime,
      latitude: +latitude,
      longitude: +longitude,
    };

    updateItinerary(newSchedule);
    setDay(newSchedule.day);
    router.back();
  };

  const toggleMapExpansion = (expand: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMapExpanded(expand);
  };

  return (
    <View style={styles.container}>
      {!isMapExpanded && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>일정 수정</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleEditSchedule}
          >
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[styles.mapContainer, isMapExpanded && styles.mapContainerExpanded]}
      >
        <InteractiveMapView
          cameraPosition={{
            latitude: parseFloat(latitude) || 37.5665,
            longitude: parseFloat(longitude) || 126.978,
            zoom: isMapExpanded ? 14 : 10,
          }}
          clusterMarkers={[
            {
              identifier: 'my-location',
              latitude: parseFloat(latitude) || 37.5665,
              longitude: parseFloat(longitude) || 126.978,
            },
          ]}
          options={{
            searchBar: isMapExpanded,
            currentLocationButton: true,
          }}
        />

        {/* This overlay captures the press to expand, only when not expanded */}
        {!isMapExpanded && (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
            onPress={() => toggleMapExpansion(true)}
          />
        )}

        {isMapExpanded && (
          <SafeAreaView
            style={styles.expandedMapOverlayContainer}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              onPress={() => toggleMapExpansion(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>

      {!isMapExpanded && (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

          {/* Other form sections... */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Day</Text>
            <TextInput
              value={localDay}
              onChangeText={setLocalDay}
              placeholder='Day'
              placeholderTextColor={'#9A9A9A'}
              style={styles.input}
              keyboardType='number-pad'
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>일정 내용</Text>
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
            <Text style={styles.label}>시작 시간</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.input}
            >
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeText}>{startTime.substring(0, 5)}</Text>
                <Ionicons name='time-outline' size={20} color='#8130FF' />
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode={'time'}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}
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
      )}
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
    marginBottom: 20,
  },
  mapContainerExpanded: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    marginBottom: 0,
    zIndex: 10, // Make sure map is on top
  },
  expandedMapOverlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40, // Safe area for status bar
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure close button is on top of everything
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
  timeText: {
    fontSize: 14,
    color: '#000',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EditTemplateItineraryScreen;
