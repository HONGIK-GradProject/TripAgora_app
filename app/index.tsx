import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const { accessToken, isLoading, user, isNewUser } = useAuth();

  // 인증 상태를 확인하는 동안에는 화면 깜빡임을 방지합니다.
  if (isLoading) {
    return <View />;
  }

  // 토큰이 없으면 로그인 화면으로 보냅니다.
  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  // 아래는 토큰이 있을 경우

  // 신규 사용자이거나 닉네임이 비어있으면 프로필 설정 화면으로 보냅니다.
  if (isNewUser || !user?.nickname || user?.nickname === '') {
    return <Redirect href="/login/set-profile" />;
  }

  // 관심사 태그가 비어있으면 관심사 태그 설정 화면으로 보냅니다.
  if (!user.tagIds || user.tagIds.length === 0) {
    return <Redirect href="/login/set-interests" />;
  }

  // 기존 사용자면 역할에 따라 홈 화면으로 보냅니다.
  if (user?.role === 'GUIDE') {
    return <Redirect href="/guide/home" />;
  }

  return <Redirect href="/traveler/home" />;

}