import { InteractiveMapView } from '@/components/map/InteractiveMapView';
import { useAuth } from '@/hooks/useAuth';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { Ionicons } from '@expo/vector-icons';
import { ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface LocationData {
  userId: number;
  nickname: string;
  latitude: number;
  longitude: number;
};

export interface LocationSharingProps {
  roomId: number;
}

const COLORS = ['blue', 'green', 'pink', 'lightblue', 'yellow', 'red'];
const COLOR_CODES = ['#4DB1FF', '#08DA76', '#E355A9', '#01C6D8', '#FFC801', '#FF4D60'];

const MOCK_DATA = [
  { userId: 123, nickname: 'User1', latitude: 37.5665, longitude: 126.978 },
  { userId: 321, nickname: 'User2', latitude: 37.5700, longitude: 126.980 },
];

const LocationSharingView: React.FC<LocationSharingProps> = ({ roomId }) => {
  const [locations, setLocations] = useState<LocationData[]>(MOCK_DATA);
  const [myLocation, setMyLocation] = useState<LocationData | null>(null);

  const { user } = useAuth();
  // Location 권한
  const { status, requestPermission } = useLocationPermission();

  const handleUpdateLocation = useCallback(async () => {
    if (status !== Location.PermissionStatus.GRANTED) {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const { latitude, longitude } = location.coords;
    setMyLocation({
      latitude,
      longitude,
      userId: user?.id || 0,
      nickname: user?.nickname || ''
    });
  }, [status, user]);

  useEffect(() => {
    const handleInit = async () => {
      await handleGetPermission();
      await handleUpdateLocation();
    }

    handleInit();
  }, [roomId]);

  useEffect(() => {
    if (status === Location.PermissionStatus.GRANTED) {
      const intervalId = setInterval(handleUpdateLocation, 5000);
      return () => clearInterval(intervalId);
    }
  }, [status, handleUpdateLocation]);

  const handleGetPermission = async () => {
    let currentStatus = status;

    if (currentStatus !== Location.PermissionStatus.GRANTED) {
      currentStatus = await requestPermission();
    }

    if (currentStatus !== Location.PermissionStatus.GRANTED) {
      Alert.alert(
        '권한 필요',
        '현재 위치 기능을 사용하려면 위치 정보 접근 권한이 필요합니다.'
      );
      return;
    }
  };

  const finalLocations = useMemo(() => {
    if (myLocation) {
      return [myLocation, ...locations];
    }
    return locations;
  }, [locations, myLocation]);

  const clusterMarkers = useMemo(() => {
    if (!finalLocations || finalLocations.length < 1) {
      return [];
    }

    return finalLocations.map((loc, index) => {
      return {
        identifier: Date.now().toString(),
        latitude: loc.latitude,
        longitude: loc.longitude,
        image: {
          symbol: COLORS[index % COLORS.length],
        },
        width: 30,
        height: 40,
      } as ClusterMarkerProp;
    });
  }, [finalLocations]);

  const getDistance = (latitude: number, longitude: number) => {
    if (!myLocation) return 0;

    const dist = haversine(myLocation, {latitude, longitude});
    const kmDist = dist / 1000;

    return kmDist.toFixed(1);
  }

  return (
    <View style={styles.container}>    
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mapContainer}>
          <InteractiveMapView
            cameraPosition={{
              latitude: 37.5665,
              longitude: 126.978,
              zoom: 10,
            }}
            clusterMarkers={clusterMarkers}
          />
        </View>

        <View style={styles.memberList}>
          {finalLocations.map((loc, index) => (
            <View style={styles.memberItem} key={loc.userId}>
              <Ionicons name="person-circle" size={40} color={COLOR_CODES[index % COLOR_CODES.length]} style={styles.memberIcon} />
              <Text style={styles.memberName}>{loc.nickname}</Text>
              <Text style={styles.memberDistance}>{
              loc.userId === user?.id ? '나' : 
                myLocation ? `${getDistance(loc.latitude, loc.longitude)} km` : '?'
              }
              </Text>
            </View>))
          }
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleUpdateLocation}>
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
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  distanceText: {
    fontSize: 16,
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
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  memberDistance: {
    fontSize: 16,
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

export default LocationSharingView;
