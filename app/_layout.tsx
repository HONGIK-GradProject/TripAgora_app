import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '@/contexts/AuthContext';
import { StompProvider } from '@/contexts/StompContext';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import * as Notifications from 'expo-notifications';

// 앱이 포어그라운드에서 실행 중일 때 알림을 어떻게 처리할지 설정합니다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (lastNotificationResponse && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      // TODO: url을 실제 deep link property로 변경
      const { type, sessionId } = lastNotificationResponse.notification.request.content.data;
      if (sessionId) {
        router.push(`/traveler/trip/${sessionId}/session-room` as any);
      }
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StompProvider>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(app)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
          </ThemeProvider>
        </StompProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
