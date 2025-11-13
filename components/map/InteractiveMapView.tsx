import { useLocationPermission } from '@/hooks/useLocationPermission';
import { fetchKakaoPlaceSearch } from '@/services/search';
import {
  Camera,
  CameraMoveBaseParams,
  ClusterMarkerProp,
  Coord,
  NaverMapPathOverlay,
  NaverMapViewRef,
  Region,
} from '@mj-studio/react-native-naver-map';
import * as Location from 'expo-location';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { MapOverlay } from './MapOverlay';
import { MapView } from './MapView';

const DEFAULT_COORDS = [
  { latitude: 0, longitude: 0},
  { latitude: 0, longitude: 0}
]

export interface MapOverlayOptions {
  searchBar?: boolean;
  currentLocationButton?: boolean;
  drawPath?: boolean;
}

interface InteractiveMapViewProps {
  cameraPosition: Camera;
  clusterMarkers: ClusterMarkerProp[];
  options?: MapOverlayOptions;
  onPlaceSelect?: (place: { name: string, latitude: number; longitude: number }) => void;
  onMarkerClick?: (markerIdentifier: string) => void;
}

export interface InteractiveMapViewRef {
  animateCameraTo: (camera: CameraMoveBaseParams & Coord & { zoom: number }) => void
  animateRegionTo: (camera: CameraMoveBaseParams & Region) => void;
}

export const InteractiveMapView = memo(
  forwardRef<InteractiveMapViewRef, InteractiveMapViewProps>(
    (
      { cameraPosition, clusterMarkers, options, onPlaceSelect, onMarkerClick },
      ref
    ) => {
      const mapViewRef = useRef<NaverMapViewRef>(null);
      const { status, requestPermission } = useLocationPermission();
      const [searchQuery, setSearchQuery] = useState('');
      const [isMapReady, setIsMapReady] = useState(false);
      
      // Child component의 렌더링 딜레이
      useEffect(() => {
        const timer = setTimeout(() => setIsMapReady(true), 100);
        return () => clearTimeout(timer);
      }, []);

      // 외부에서 지도를 제어할 수 있도록 ref를 노출
      useImperativeHandle(ref, () => ({
        animateCameraTo: (camera) => {
          mapViewRef.current?.animateCameraTo(camera);
        },
        animateRegionTo: (camera) => {
          mapViewRef.current?.animateRegionTo(camera);
        }
      }));

      const handleSearch = async (query: string) => {
        try {
          const data = await fetchKakaoPlaceSearch(query);
          if (data && data.documents.length > 0) {
            const { place_name, x, y } = data.documents[0];
            const latitude = parseFloat(y);
            const longitude = parseFloat(x);

            mapViewRef.current?.animateCameraTo({
              latitude,
              longitude,
              zoom: 12,
              duration: 1000,
            });

            // Notify the parent component of the selected place
            if (onPlaceSelect) {
              onPlaceSelect({ name: place_name, latitude, longitude });
            }
          } else {
            Alert.alert('검색 결과 없음', `'${query}'에 대한 결과가 없습니다.`);
          }
        } catch (error) {
          console.error('장소 검색 실패', error);
          Alert.alert('오류', '장소 검색 중 오류가 발생했습니다.');
        }
      };

      const handleCenterToCurrentLocation = async () => {
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

        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          mapViewRef.current?.animateCameraTo({
            latitude,
            longitude,
            zoom: 14,
            duration: 1000,
            easing: 'EaseOut',
          });
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
            clusterMarkers={clusterMarkers.length > 0 ? clusterMarkers : undefined}
            onMarkerClick={onMarkerClick}
          >
            {isMapReady && (
              <NaverMapPathOverlay
                coords={clusterMarkers && clusterMarkers.length >= 2 ?
                  clusterMarkers.map(marker => ({
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  } as Coord)) :
                  DEFAULT_COORDS
                }
                width={8}
                color="#8130FF"
                outlineWidth={2}
                outlineColor="#dbc7ff"
              />
            )}
          </MapView>
          <MapOverlay
            options={options}
            onCenterToCurrentLocation={handleCenterToCurrentLocation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
