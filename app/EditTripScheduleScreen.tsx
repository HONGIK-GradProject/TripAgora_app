import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const EditTripScheduleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정 편집하기</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/428x442' }} style={styles.mapImage} />
          {/* 지도 위에 표시될 마커 등은 추후 구현 */}
        </View>

        <View style={styles.daySelection}>
          <TouchableOpacity style={[styles.dayButton, styles.dayButtonActive]}>
            <Text style={styles.dayButtonTextActive}>1일차</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dayButton}>
            <Text style={styles.dayButtonText}>2일차</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          <View style={styles.scheduleItem}>
            <Ionicons name="location" size={30} color="#FF0000" style={styles.scheduleIcon} />
            <Text style={styles.scheduleText}>
              (장소){'\n'}
              (내용(선택))
            </Text>
            <TouchableOpacity style={styles.deleteButton}>
              <Ionicons name="close-circle" size={24} color="#FF2525" />
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="location" size={30} color="#FF9500" style={styles.scheduleIcon} />
            <Text style={styles.scheduleText}>
              (장소){'\n'}
              (내용(선택))
            </Text>
            <TouchableOpacity style={styles.deleteButton}>
              <Ionicons name="close-circle" size={24} color="#FF2525" />
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="location" size={30} color="#00FFFF" style={styles.scheduleIcon} />
            <Text style={styles.scheduleText}>
              (장소){'\n'}
              (내용(선택))
            </Text>
            <TouchableOpacity style={styles.deleteButton}>
              <Ionicons name="close-circle" size={24} color="#FF2525" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addScheduleButton}>
            <Ionicons name="add-circle" size={30} color="#8130FF" />
            <Text style={styles.addScheduleButtonText}>일정 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 날짜 선택기 (임시) */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>날짜 선택</Text>
          {/* 실제 날짜 선택기 컴포넌트가 들어갈 자리 */}
          <Text>2025년 8월 17일</Text>
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
    paddingBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 442,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  daySelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    color: '#8130FF',
  },
  dayButtonTextActive: {
    fontSize: 20,
    color: '#fff',
  },
  scheduleList: {
    paddingHorizontal: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  scheduleIcon: {
    marginRight: 15,
  },
  scheduleText: {
    flex: 1,
    fontSize: 20,
    color: '#000',
  },
  deleteButton: {
    marginLeft: 10,
  },
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
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 10,
  },
  datePickerContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  datePickerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default EditTripScheduleScreen;
