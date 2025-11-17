import {
  InteractiveMapView,
  InteractiveMapViewRef,
} from '@/components/map/InteractiveMapView';
import { useAuth } from '@/hooks/useAuth';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { Ionicons } from '@expo/vector-icons';
import { ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LocationData {
  userId: number;
  nickname: string;
  latitude: number;
  longitude: number;
  profileImageUrl?: string;
}

export interface LocationSharingProps {
  roomId: number;
}

const COLORS = ['blue', 'green', 'pink', 'lightblue', 'yellow', 'red'];
const COLOR_CODES = [
  '#4DB1FF',
  '#08DA76',
  '#E355A9',
  '#01C6D8',
  '#FFC801',
  '#FF4D60',
];

const MOCK_DATA = [
  {
    userId: 123,
    nickname: 'User1',
    latitude: 37.5665,
    longitude: 126.978,
    profileImageUrl: undefined,
  },
  {
    userId: 321,
    nickname: 'User2',
    latitude: 37.57,
    longitude: 126.98,
    profileImageUrl: undefined,
  },
];

const LocationSharingView: React.FC<LocationSharingProps> = ({ roomId }) => {
  const [locations, setLocations] = useState<LocationData[]>(MOCK_DATA);
  const [myLocation, setMyLocation] = useState<LocationData | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapViewRef = useRef<InteractiveMapViewRef>(null);
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
      nickname: user?.nickname || '',
      profileImageUrl: user?.profileImageUrl,
    });
  }, [status, user]);

  useEffect(() => {
    const handleInit = async () => {
      await handleGetPermission();
      await handleUpdateLocation();
    };

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
    const result: LocationData[] = [];

    // 내 위치를 항상 맨 위에 추가 (위치가 없어도)
    if (user) {
      if (myLocation) {
        result.push(myLocation);
      } else {
        // 위치가 아직 확인되지 않은 경우 임시 데이터 추가
        result.push({
          userId: user.id || 0,
          nickname: user.nickname || '나',
          latitude: 0,
          longitude: 0,
          profileImageUrl: user.profileImageUrl,
        });
      }
    }

    // 다른 일행들의 위치 추가
    result.push(...locations);

    return result;
  }, [locations, myLocation, user]);

  const clusterMarkers = useMemo(() => {
    if (!finalLocations || finalLocations.length < 1) {
      return [];
    }

    // 실제 위치가 있는 것만 마커로 표시
    return finalLocations
      .filter((loc) => loc.latitude !== 0 && loc.longitude !== 0)
      .map((loc, index) => {
        return {
          identifier: `${loc.userId}-${Date.now()}`,
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

    const dist = haversine(myLocation, { latitude, longitude });
    const kmDist = dist / 1000;

    return kmDist.toFixed(1);
  };

  const handleMemberItemPress = useCallback((location: LocationData) => {
    // 위치가 확인되지 않은 경우 포커스하지 않음
    if (location.latitude === 0 && location.longitude === 0) {
      return;
    }

    mapViewRef.current?.animateCameraTo({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 16,
      duration: 500,
      easing: 'EaseOut',
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일행 위치 확인</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <InteractiveMapView
            ref={mapViewRef}
            cameraPosition={{
              latitude: 37.5665,
              longitude: 126.978,
              zoom: 10,
            }}
            clusterMarkers={clusterMarkers}
          />
        </View>

        <View style={styles.memberList}>
          {finalLocations.map((loc, index) => {
            const colorCode = COLOR_CODES[index % COLOR_CODES.length];
            const hasValidLocation = loc.latitude !== 0 || loc.longitude !== 0;
            return (
              <TouchableOpacity
                style={styles.memberItem}
                key={loc.userId}
                onPress={() => handleMemberItemPress(loc)}
                activeOpacity={hasValidLocation ? 0.7 : 1}
                disabled={!hasValidLocation}
              >
                <View style={styles.profileContainer}>
                  {loc.profileImageUrl ? (
                    <Image
                      source={{ uri: loc.profileImageUrl }}
                      style={styles.profileImage}
                      contentFit='cover'
                    />
                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <Ionicons
                        name='person-outline'
                        size={20}
                        color='#9CA3AF'
                      />
                    </View>
                  )}
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: colorCode },
                    ]}
                  />
                </View>
                <Text style={styles.memberName}>{loc.nickname}</Text>
                <Text style={styles.memberDistance}>
                  {loc.userId === user?.id
                    ? myLocation
                      ? '나'
                      : '내 위치 확인 중...'
                    : myLocation
                    ? `${getDistance(loc.latitude, loc.longitude)} km`
                    : '?'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleUpdateLocation}
        >
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollViewContent: {
    paddingTop: 0,
    paddingBottom: 120, // 하단 액션 버튼 공간 확보
  },
  mapContainer: {
    width: '100%',
    height: 317,
    backgroundColor: '#F3F4F6',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  memberDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  callButton: {
    backgroundColor: '#5B67F5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B67F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LocationSharingView;
