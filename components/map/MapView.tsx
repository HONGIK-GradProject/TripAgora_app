import { Camera, NaverMapView } from '@mj-studio/react-native-naver-map';
import { StyleSheet, ViewProps } from 'react-native';

interface MapViewProps {
  style?: ViewProps['style'];
  cameraPosition: Camera;
}

interface MapViewProps {}

export const MapView = ({ style, cameraPosition } : MapViewProps) => {
  return (
    <NaverMapView style={style ?? StyleSheet.absoluteFill} initialCamera={cameraPosition}>
    </NaverMapView>
  );
}