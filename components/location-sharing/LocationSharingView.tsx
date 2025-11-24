import {
  InteractiveMapView,
  InteractiveMapViewRef,
} from '@/components/map/InteractiveMapView';
import { UserLocation } from '@/types/location-sharing';
import { getHaversineDistance } from '@/utils/coords';
import { Ionicons } from '@expo/vector-icons';
import { ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LocationSharingProps {
  myLocation?: UserLocation;
  locations?: UserLocation[];
  user?: {
    _id: string | number;
  };
  onPressBack?: () => void;
}

export type LocationSharingViewRef = InteractiveMapViewRef;

const COLORS = ['blue', 'green', 'pink', 'lightblue', 'yellow', 'red'];
const COLOR_CODES = [
  '#4DB1FF',
  '#08DA76',
  '#E355A9',
  '#01C6D8',
  '#FFC801',
  '#FF4D60',
];

const LocationSharingView = forwardRef<
  LocationSharingViewRef,
  LocationSharingProps
>(({ myLocation, locations, user, onPressBack }, ref) => {
  const interactiveMapViewRef = useRef<InteractiveMapViewRef>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    animateCameraTo: (camera) => {
      interactiveMapViewRef.current?.animateCameraTo(camera);
    },
    animateRegionTo: (camera) => {
      interactiveMapViewRef.current?.animateRegionTo(camera);
    },
  }));

  const handlePressBack = () => {
    onPressBack?.();
    router.back();
  };

  const clusterMarkers = useMemo(() => {
    if (!locations || locations.length < 1) {
      return [];
    }

    // 실제 위치가 있는 것만 마커로 표시
    return locations
      .filter((loc) => loc.latitude !== 0 && loc.longitude !== 0)
      .map((loc, index) => {
        return {
          identifier: String(loc.userId),
          latitude: loc.latitude,
          longitude: loc.longitude,
          image: {
            httpUri: loc.profileImageUrl,
          },
          width: 40,
          height: 40,
        } as ClusterMarkerProp;
      });
  }, [locations]);

  const sortedLocations = useMemo(() => {
    if (!locations) return [];

    // 1. Pre-calculate distance for each location
    const locationsWithDistance = locations.map((loc) => ({
      ...loc,
      distance:
        myLocation && (loc.latitude !== 0 || loc.longitude !== 0)
          ? getHaversineDistance(myLocation, loc.latitude, loc.longitude)
          : null,
    }));

    // 2. Sort the new array
    locationsWithDistance.sort((a, b) => {
      // "Me" always comes first
      if (a.userId === user?._id) return -1;
      if (b.userId === user?._id) return 1;

      // Group users with valid distance before those without
      if (a.distance !== null && b.distance === null) return -1;
      if (a.distance === null && b.distance !== null) return 1;

      // For users without valid distance, keep relative order
      if (a.distance === null && b.distance === null) return 0;

      // Sort by distance (will not be null here)
      return a.distance! - b.distance!;
    });

    return locationsWithDistance;
  }, [locations, user, myLocation]);

  const handleMemberItemPress = useCallback((location: UserLocation) => {
    // 위치가 확인되지 않은 경우 포커스하지 않음
    if (location.latitude === 0 && location.longitude === 0) {
      return;
    }

    interactiveMapViewRef.current?.animateCameraTo({
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
      <View style={[styles.header, { paddingTop: insets.top - 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handlePressBack}>
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
            ref={interactiveMapViewRef}
            cameraPosition={{
              latitude: 37.5665,
              longitude: 126.978,
              zoom: 10,
            }}
            clusterMarkers={clusterMarkers}
          />
        </View>

        <View style={styles.memberList}>
          {sortedLocations.map((loc, index) => {
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
                  {loc.userId === user?._id
                    ? myLocation
                      ? '나'
                      : '내 위치 확인 중...'
                    : loc.distance !== null
                    ? loc.distance < 1
                      ? `${Math.round(loc.distance * 1000)} m`
                      : `${loc.distance.toFixed(1)} km`
                    : '측정 불가'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>일행 호출하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
