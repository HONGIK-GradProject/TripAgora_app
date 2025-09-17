import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 로그인 화면을 렌더링하는 React 컴포넌트입니다.
 * 카카오 로그인 버튼을 포함하며, 로그인 성공 시 프로필 설정 화면으로 이동합니다.
 */
const LoginScreen: React.FC = () => {
  /**
   * 카카오 로그인을 처리하는 비동기 함수입니다.
   * 로그인 성공 시 액세스 토큰을 받아 콘솔에 출력하고, '/login/set-profile' 경로로 라우팅합니다.
   * 실패 시 에러를 콘솔에 출력합니다.
   */

  const { accessToken, isNewUser, signIn } = useAuth();

  // TODO: SplashScreen에서 토큰 검사가 진행 되도록 해야 함

  /**
   * 액세스 토큰이 변경될 때마다 실행되는 사이드 이펙트입니다.
   * 액세스 토큰이 존재하면, 사용자가 신규 사용자일 경우 프로필 설정 화면으로,
   * 기존 사용자일 경우 홈 화면으로 라우팅합니다.
   */
  useEffect(() => {
    if (accessToken) {
      if (isNewUser) {
        router.push('/login/set-profile');
      } else {
        router.replace('/home');
      }
    }
  }, [accessToken, isNewUser]);

  /**
   * 카카오 로그인 + 자체 로그인을 처리하는 함수입니다.
   */
  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      {/* 로고 */}
      <View className='w-[133px] h-[133px] rounded-full bg-[#D9D9D9] items-center justify-center mb-16'>
        <Text className='text-2xl text-black font-bold'>(로고)</Text>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        className='w-4/5 h-12 bg-[#FFDE03] rounded-md items-center justify-center mt-6'
        onPress={handleSignIn}
      >
        <Text className='text-xl text-white font-bold'>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
