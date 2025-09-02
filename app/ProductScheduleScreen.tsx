import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductScheduleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 일정 확인하기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.tripTitle}>
          홍대 1박2일 모임{'\n'}
          2025.03.31 - 04.01
        </Text>

        <View style={styles.mapContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/428x326' }} style={styles.mapImage} />
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
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="location" size={30} color="#FF9500" style={styles.scheduleIcon} />
            <Text style={styles.scheduleText}>
              (장소){'\n'}
              (내용(선택))
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="location" size={30} color="#00FFFF" style={styles.scheduleIcon} />
            <Text style={styles.scheduleText}>
              (장소){'\n'}
              (내용(선택))
            </Text>
          </View>
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  mapContainer: {
    width: '100%',
    height: 326,
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
  },
  scheduleIcon: {
    marginRight: 15,
  },
  scheduleText: {
    fontSize: 20,
    color: '#000',
  },
});

export default ProductScheduleScreen;
