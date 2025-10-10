import { Camera, ClusterMarkerProp, NaverMapView, NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, ViewProps } from 'react-native';

interface MapViewProps {
  style?: ViewProps['style'];
  cameraPosition: Camera;
  clusterMarkers: ClusterMarkerProp[];
  children?: React.ReactNode;
}

export const MapView = forwardRef<NaverMapViewRef, MapViewProps>(
  ({ style, cameraPosition, clusterMarkers, children }, ref) => {
    const clusters = useMemo(() => [
      {
        width: 50,          // 클러스터 마커의 너비
        height: 50,         // 클러스터 마커의 높이
        markers: clusterMarkers,
        screenDistance: 40, // 클러스터링 기준 화면 거리 (픽셀)
        minZoom: 5,         // 클러스터링할 최소 줌 레벨
        maxZoom: 18,        // 클러스터링할 최대 줌 레벨
        animate: true,      // 클러스터 펼침/합침 애니메이션
      }
    ], [clusterMarkers]);
    
    /**
     * key={Date.now()}로 설정해서 매번 렌더링 됩니다.
     * 따라서 성능 문제가 있을 수 있습니다.
     */
    return (
      <NaverMapView
        key={Date.now()}
        ref={ref}
        style={style ?? StyleSheet.absoluteFill}
        initialCamera={cameraPosition}
        clusters={clusters}
      >
        {children}
      </NaverMapView>
    );
  }
);
