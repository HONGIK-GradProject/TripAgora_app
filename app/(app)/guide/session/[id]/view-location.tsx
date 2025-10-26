import { InteractiveMapView } from '@/components/map/InteractiveMapView';
import { useAuth } from '@/hooks/useAuth';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useSocket } from '@/hooks/useSocket';
import { emitEvent, listenOn } from '@/services/socket';
import { Ionicons } from '@expo/vector-icons';
import { ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface LocationData {
  username: string;
  latitude: number;
  longitude: number;
};

/**
 * 모집 정보를 수정하는 화면입니다.
 * 모집 인원과 시작 날짜를 수정할 수 있습니다.
 */
const EditRecruitmentScreen: React.FC = () => {
  const router = useRouter();
  //const { id } = useLocalSearchParams<{ id?: string }>();

  const id = '123';

  const [clusterMarkers, setClusterMarkers] = useState<ClusterMarkerProp[]>([]);

  const { user } = useAuth();
  // Socket 통신
  const { socket, isConnected } = useSocket();
  // Location 권한
  const { status, requestPermission } = useLocationPermission();

  useEffect(() => {
    handleGetPermission();
  }, []);

  useEffect(() => {
    console.log(isConnected);
    if (isConnected && id) {
      // Join
      emitEvent('join', id);

      const handleUpdate = (data: LocationData[]) => {
        const newClusterMarkers = toClusterMarkers(data);
        setClusterMarkers(newClusterMarkers);
        console.log(data);
      }

      listenOn('locationUpdated', handleUpdate);

      return () => {
        socket.off('locationUpdated', handleUpdate);
      }
    }
  }, [isConnected, id]);

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

  const handleUpdateLocation = async () => {
    if (status !== Location.PermissionStatus.GRANTED) {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const { latitude, longitude } = location.coords;

    const updateData = {
      roomId: id,
      nickname: user?.nickname,
      latitude, longitude
    };

    try {
      emitEvent('locationUpdate', updateData);
    }
    catch (error) {
      console.error(error);
    }
  };

  const toClusterMarkers = (data: LocationData[]) => {
    if (!data || data.length < 1) {
      return [];
    }

    return data.map((location, index) => {
      return {
        identifier: Date.now().toString(),
        latitude: location.latitude,
        longitude: location.longitude,
        image: {
          symbol: 'blue',
          size: 20,
        },
      } as ClusterMarkerProp;
    });
  };

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

export default EditRecruitmentScreen;
