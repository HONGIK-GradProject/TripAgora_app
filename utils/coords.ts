import { Coord } from "@mj-studio/react-native-naver-map";
import haversine from 'haversine-distance';

export const getHaversineDistance = (myLocation: Coord, latitude: number, longitude: number) => {
  if (!myLocation) return 0;

  const dist = haversine(myLocation, { latitude, longitude });
  const kmDist = dist / 1000;

  return kmDist;
};