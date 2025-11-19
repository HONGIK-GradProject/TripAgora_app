import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { tripagoraLogoSvg } from './tripagora-logo-svg';

interface TripAgoraLogoProps {
  size?: number;
}

const TripAgoraLogo: React.FC<TripAgoraLogoProps> = ({ size = 100 }) => {
  return (
    <View style={{ width: size, height: size }}>
      <SvgXml xml={tripagoraLogoSvg} width='100%' height='100%' />
    </View>
  );
};

export default TripAgoraLogo;
