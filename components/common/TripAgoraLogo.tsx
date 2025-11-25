import React from 'react';
import TripAgoraLogoSvg from '@/assets/images/tripagora-logo.svg';

interface TripAgoraLogoProps {
  size?: number;
}

const TripAgoraLogo: React.FC<TripAgoraLogoProps> = ({ size = 100 }) => {
  return <TripAgoraLogoSvg width={size} height={size} />;
};

export default TripAgoraLogo;
