import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AddScheduleItemScreen: React.FC = () => {
  const router = useRouter();

  const [place, setPlace] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [time, setTime] = useState<string>('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 추가</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
        >
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
          <Text style={styles.label}>장소</Text>
          <TextInput
            value={place}
            onChangeText={setPlace}
            placeholder='장소를 입력하세요'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>내용 (선택)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder='설명을 입력하세요'
            placeholderTextColor={'#9A9A9A'}
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical='top'
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>시간 (선택)</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder='예: 14:30'
            placeholderTextColor={'#9A9A9A'}
            style={styles.input}
            keyboardType='numbers-and-punctuation'
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 24,
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
    fontSize: 16,
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
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF',
  },
  multiline: {
    minHeight: 100,
  },
});

export default AddScheduleItemScreen;
