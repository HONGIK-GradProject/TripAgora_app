import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationShareScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일행 위치 확인하기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/428x317' }} style={styles.mapImage} />
          {/* 지도 위에 표시될 마커 등은 추후 구현 */}
        </View>

        <View style={styles.destinationInfo}>
          <Ionicons name="location" size={30} color="#FF0000" style={styles.destinationIcon} />
          <Text style={styles.destinationText}>다음 목적지</Text>
          <Text style={styles.distanceText}>320m</Text>
        </View>

        <View style={styles.memberList}>
          <View style={styles.memberItem}>
            <Ionicons name="person-circle" size={40} color="#FF0000" style={styles.memberIcon} />
            <Text style={styles.memberName}>김 홍익</Text>
            <Text style={styles.memberDistance}>나</Text>
          </View>
          <View style={styles.memberItem}>
            <Ionicons name="person-circle" size={40} color="#FFFF00" style={styles.memberIcon} />
            <Text style={styles.memberName}>엄 복동</Text>
            <Text style={styles.memberDistance}>10m</Text>
          </View>
          <View style={styles.memberItem}>
            <Ionicons name="person-circle" size={40} color="#00FFFF" style={styles.memberIcon} />
            <Text style={styles.memberName}>홍 길동</Text>
            <Text style={styles.memberDistance}>25m</Text>
          </View>
          <View style={styles.memberItem}>
            <Ionicons name="person-circle" size={40} color="#FF9500" style={styles.memberIcon} />
            <Text style={styles.memberName}>박 대기</Text>
            <Text style={styles.memberDistance}>11m</Text>
          </View>
          <View style={styles.memberItem}>
            <Ionicons name="person-circle" size={40} color="#00FF00" style={styles.memberIcon} />
            <Text style={styles.memberName}>정 신줄</Text>
            <Text style={styles.memberDistance}>133m</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>일행 호출하기</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120, // 하단 액션 버튼 공간 확보
  },
  mapContainer: {
    width: '100%',
    height: 317,
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
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  destinationIcon: {
    marginRight: 10,
  },
  destinationText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  distanceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  memberList: {
    paddingHorizontal: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberIcon: {
    marginRight: 15,
  },
  memberName: {
    fontSize: 24,
    color: '#000',
    flex: 1,
  },
  memberDistance: {
    fontSize: 24,
    color: '#000',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  callButton: {
    backgroundColor: '#8130FF',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LocationShareScreen;
