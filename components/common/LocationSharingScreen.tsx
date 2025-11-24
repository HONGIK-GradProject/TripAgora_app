import { useAuth } from "@/hooks/useAuth";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useStomp } from "@/hooks/useStomp";
import { fetchPreviousLocations } from "@/services/location-sharing";
import { UserLocation } from "@/types/location-sharing";
import { Coord } from "@mj-studio/react-native-naver-map";
import { Message } from "@stomp/stompjs";
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import CustomSafeAreaView from "../CustomSafeAreaView";
import LocationSharingView from "../location-sharing/LocationSharingView";

interface LocationSharingScreenProps {
  roomId: number;
}

const LocationSharingScreen: React.FC<LocationSharingScreenProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { client, isConnected } = useStomp();
  const { status: locationPermissionStatus, requestPermission } = useLocationPermission();
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const [locations, setLocations] = useState<Map<number, UserLocation>>(new Map());

  useEffect(() => {
    const fetch = async () => {
      const prevLocations = await fetchPreviousLocations(roomId);
      if (prevLocations?.data) {
        setLocations(new Map(prevLocations.data.map(location => [location.userId, location])));
      }
    }
    if (roomId) {
      fetch();
    }
  }, [roomId]);

  useEffect(() => {
    if (isConnected && client.connected && roomId) {
      const destination = `/topic/room/${roomId}/location`;

      const subscription = client.subscribe(destination, (message: Message) => {
        const body = JSON.parse(message.body);

        if (body.latitude !== undefined && body.longitude !== undefined) {
          const receivedLocation: UserLocation = body;
          if (receivedLocation.updatedAt.slice(-1) !== 'Z') {
            receivedLocation.updatedAt += 'Z';
          }
          
          setLocations(prevLocations => {
            const newLocations = new Map(prevLocations);
            newLocations.set(receivedLocation.userId, receivedLocation);
            return newLocations;
          });
        }
      });

      return () => {
        if (client.connected) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, client, roomId]);

  useEffect(() => {
    const startLocationTracking = async () => {
      if (locationPermissionStatus !== 'granted') {
        const status = await requestPermission();
        if (status !== 'granted') {
          console.log('Location permission not granted');
          return;
        }
      }

      if (isConnected && user && client.connected) {
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.LocationAccuracy.BestForNavigation,
            timeInterval: 5000,
          },
          (location) => {
            if (!user.id) return;

            const locationData: Coord = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            console.log(locationData);

            client.publish({
              destination: `/publish/room/${roomId}/location`,
              body: JSON.stringify(locationData),
            });
          }
        );
      }
    };

    if (roomId) {
      startLocationTracking();
    }

    return () => {

      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isConnected, client, roomId, user, locationPermissionStatus]);


  return (
    <CustomSafeAreaView edges={['top', 'left', 'right']}>
      <LocationSharingView
        locations={Array.from(locations.values())}
        myLocation={user && user.id ? locations.get(user.id) : undefined}
        user={{
          _id: (user && user.id) ? user.id : ''
        }}
      />
    </CustomSafeAreaView>
  )
}

export default LocationSharingScreen;