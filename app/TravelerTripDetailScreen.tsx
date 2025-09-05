import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TravelerTripDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>홍대 1박2일 모임</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#8130FF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="calendar-clock" size={48} color="rgba(129, 48, 255, 0.59)" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTime}>17:00</Text>
            <Text style={styles.cardDescription}>
              자유시간 후 18:30까지 숙..
            </Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/428x326' }} style={styles.mapImage} />
          {/* 지도 위에 표시될 마커 등은 추후 구현 */}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="#8130FF" />
            <Text style={styles.actionButtonText}>일행 위치 확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.sosButton]}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#FF3030" />
            <Text style={styles.sosButtonText}>긴급 SOS</Text>
          </TouchableOpacity>
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
  notificationButton: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 하단 내비게이션 바 공간 확보
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E9E9E9',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 15,
  },
  cardTime: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 20,
    color: '#000',
  },
  mapContainer: {
    width: '100%',
    height: 326,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 10,
  },
  sosButton: {
    borderColor: '#FF3030',
  },
  sosButtonText: {
    fontSize: 20,
    color: '#FF3030',
    marginLeft: 10,
  },
});

export default TravelerTripDetailScreen;
