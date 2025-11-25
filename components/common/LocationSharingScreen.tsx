import { useAuth } from "@/hooks/useAuth";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useStomp } from "@/hooks/useStomp";
import { fetchPreviousLocations } from "@/services/location-sharing";
import { UserLocation } from "@/types/location-sharing";
import { Coord } from "@mj-studio/react-native-naver-map";
import { useFocusEffect } from "@react-navigation/native";
import { Message } from "@stomp/stompjs";
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomSafeAreaView from "../CustomSafeAreaView";
import LocationSharingView, { LocationSharingViewRef } from "../location-sharing/LocationSharingView";

interface LocationSharingScreenProps {
  roomId: number;
}

const LocationSharingScreen: React.FC<LocationSharingScreenProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { client, isConnected } = useStomp();
  const { status: locationPermissionStatus, requestPermission } = useLocationPermission();
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const locationSharingViewRef = useRef<LocationSharingViewRef>(null);
  const hasInitiallyMovedCamera = useRef(false);

  const [locations, setLocations] = useState<Map<number, UserLocation>>(new Map());
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

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
    let isActive = true;

    const startLocationTracking = async () => {
      if (locationPermissionStatus !== 'granted') {
        const status = await requestPermission();
        if (status !== 'granted') {
          return;
        }
      }
      
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.BestForNavigation,
          timeInterval: 5000,
        },
        (location) => {
          if (!isActive || !user?.id) {
            return;
          }

          const locationData: Coord = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          client.publish({
            destination: `/publish/room/${roomId}/location`,
            body: JSON.stringify(locationData),
          });
        }
      );

      if (isActive) {
        locationSubscription.current = subscription;
      } else {
        subscription.remove();
      }
    };

    if (isFocused && isConnected && user) {
      startLocationTracking();
    }

    return () => {
      isActive = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [isFocused, isConnected, client, user, roomId, locationPermissionStatus, requestPermission]);


  const locationsArray = useMemo(() => Array.from(locations.values()), [locations]);
  const myLocation = useMemo(
    () => (user && user.id ? locations.get(user.id) : undefined),
    [user, locations]
  );
  const locationSharingUser = useMemo(
    () => ({
      _id: (user && user.id) ? user.id : ''
    }),
    [user]
  );

  const stopLocationTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  }, []);

  useEffect(() => {
    if (myLocation && locationSharingViewRef.current && !hasInitiallyMovedCamera.current) {
      locationSharingViewRef.current.animateCameraTo({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        zoom: 16,
        duration: 1000,
      });
      hasInitiallyMovedCamera.current = true;
    }
  }, [myLocation]);

  return (
    <CustomSafeAreaView edges={['top', 'left', 'right']}>
      <LocationSharingView
        ref={locationSharingViewRef}
        locations={locationsArray}
        myLocation={myLocation}
        user={locationSharingUser}
        onPressBack={stopLocationTracking}
      />
    </CustomSafeAreaView>
  )
}

export default LocationSharingScreen;