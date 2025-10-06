import { useLocationPermission } from '@/hooks/useLocationPermission';
import {
  Camera,
  ClusterMarkerProp,
  NaverMapViewRef
} from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { MapOverlay } from './MapOverlay';
import { MapView } from './MapView';

export interface MapOverlayOptions {
  searchBar?: boolean;
  currentLocationButton?: boolean;
}

interface InteractiveMapViewProps {
  cameraPosition: Camera;
  clusterMarkers: ClusterMarkerProp[];
  children?: React.ReactNode;
  options?: MapOverlayOptions;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
}

export const InteractiveMapView = ({
  cameraPosition,
  clusterMarkers,
  children,
  options,
  searchQuery,
  onSearchChange,
  onSearchClear,
}: InteractiveMapViewProps) => {
  const mapViewRef = useRef<NaverMapViewRef>(null);
  const { status, requestPermission } = useLocationPermission();

  const handleCenterToCurrentLocation = async () => {
    let currentStatus = status;

    // If permission is not determined or denied, request it.
    if (currentStatus !== Location.PermissionStatus.GRANTED) {
      currentStatus = await requestPermission();
    }

    // If permission is still not granted, show an alert and exit.
    if (currentStatus !== Location.PermissionStatus.GRANTED) {
      Alert.alert(
        '권한 필요',
        '현재 위치 기능을 사용하려면 위치 정보 접근 권한이 필요합니다.'
      );
      return;
    }

    // Get location and move the camera.
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapViewRef.current?.animateCameraTo({ latitude, longitude, zoom: 14, duration: 1000, easing: 'EaseOut' });
    } catch (error) {
      console.error('Failed to get current location:', error);
      Alert.alert('오류', '현재 위치를 가져오는 데 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        cameraPosition={cameraPosition}
        clusterMarkers={clusterMarkers}
      >
        {children}
      </MapView>
      <MapOverlay
        options={options}
        onCenterToCurrentLocation={handleCenterToCurrentLocation}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});