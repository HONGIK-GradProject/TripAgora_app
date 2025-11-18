import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useExpoPushToken = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    const getToken = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          throw new Error('Failed to get push token for push notification!');
        }

        const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
          throw new Error('Project ID not found');
        }

        const token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
        setExpoPushToken(token);

        console.log('New ExpoPushToken:', token);

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      } catch (e) {
        setError(e);
      }
    };

    if (Device.isDevice) {
      getToken();
    }
  }, []);

  return { expoPushToken, error };
};
