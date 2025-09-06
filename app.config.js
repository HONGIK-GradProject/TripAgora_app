export default{
  "expo": {
    "name": "gradproj",
    "slug": "gradproj",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "gradproj",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          "kakaoAppKey": process.env.EXPO_PUBLIC_KAKAO_API_KEY,
          "overrideKakaoSDKVersion": "2.11.2",
          "kotlinVersion": "2.0.21"
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": [
              "https://devrepo.kakao.com/nexus/content/groups/public/"
            ]
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
