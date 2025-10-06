import { Camera, ClusterMarkerProp } from '@mj-studio/react-native-naver-map';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MapOverlay } from './MapOverlay';
import { MapView } from './MapView';

interface InteractiveMapViewProps {
  cameraPosition: Camera;
  clusterMarkers: ClusterMarkerProp[];
  children?: React.ReactNode;
}

const clusterMarkers: ClusterMarkerProp[] = [
  {
    identifier: 'marker-1',
    latitude: 37.5665,
    longitude: 126.9780,
    image: { symbol: 'red' }, // 또는 { httpUri: 'https://...' }, { assetName: 'marker' } 등
    width: 40,
    height: 40,
  },
  {
    identifier: 'marker-2',
    latitude: 37.5675,
    longitude: 126.9785,
    image: { symbol: 'blue' },
    width: 40,
    height: 40,
  },
  // ... 더 많은 마커들
];

export const InteractiveMapView = ({ cameraPosition, clusterMarkers, children }: InteractiveMapViewProps) => {
  return (
    <View style={styles.container}>
      <MapView
        cameraPosition={cameraPosition}
        clusterMarkers={clusterMarkers}
      >{children}</MapView>
      <MapOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});