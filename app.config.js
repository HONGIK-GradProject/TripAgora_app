export default {
  expo: {
    name: 'gradproj',
    slug: 'gradproj',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'gradproj',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.tripagora.app',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'b50316a6-3307-4d05-99a4-67a42fd6b048',
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        '@react-native-seoul/kakao-login',
        {
          kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_API_KEY,
          overrideKakaoSDKVersion: '2.11.2',
          kotlinVersion: '2.0.21',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            extraMavenRepos: [
              'https://devrepo.kakao.com/nexus/content/groups/public/',
              'https://repository.map.naver.com/archive/maven'
            ],
            usesCleartextTraffic: true,
          },
          ios: {
            flipper: true,
          },
        },
      ],
      'expo-secure-store',
      [
        '@mj-studio/react-native-naver-map',
        {
          client_id: process.env.EXPO_PUBLIC_NAVER_API_ID,
          android: {
            ACCESS_FINE_LOCATION: true,
            ACCESS_COARSE_LOCATION: true,
            ACCESS_BACKGROUND_LOCATION: true
          },
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location.",
          "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location while you are using the app."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
