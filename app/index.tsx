import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const { accessToken, isLoading, isNewUser } = useAuth();

  // 인증 상태를 확인하는 동안에는 화면 깜빡임을 방지합니다.
  if (isLoading) {
    return <View />;
  }

  // 토큰이 없으면 로그인 화면으로 보냅니다.
  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  // 토큰이 있고, 신규 사용자이면 프로필 설정 화면으로 보냅니다.
  if (isNewUser) {
    return <Redirect href="/login/set-profile" />;
  }

  // 토큰이 있고, 기존 사용자이면 홈 화면으로 보냅니다.
  return <Redirect href="/home" />;
}

