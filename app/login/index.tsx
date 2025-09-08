import { signIn } from '@/api/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 로그인 화면을 렌더링하는 React 컴포넌트입니다.
 * 카카오 로그인 버튼을 포함하며, 로그인 성공 시 프로필 설정 화면으로 이동합니다.
 */
const LoginScreen: React.FC = () => {

  const router = useRouter();

  /**
   * 카카오 로그인을 처리하는 비동기 함수입니다.
   * 로그인 성공 시 액세스 토큰을 받아 콘솔에 출력하고, '/login/set-profile' 경로로 라우팅합니다.
   * 실패 시 에러를 콘솔에 출력합니다.
   */
  const handleKakaoSignIn = async () => {
    try {
      // 카카오 로그인 로직, 잠시 주석 처리
      //const accessToken = await kakaoSignIn();
      //console.warn('Token: ', accessToken);
      const accessToken = 'sKVjIHZWJ8yPJ-XJv71m_D_-fq4poFXbAAAAAQoNFN0AAAGZKjRcBEPPWzORmYVE'; // Test token
      await signIn(accessToken);
      router.push('/login/set-profile');
    } catch (error: Error | any) {
      console.error('Kakao login failed:', error.cause);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* 로고 */}
      <View className="w-[133px] h-[133px] rounded-full bg-[#D9D9D9] items-center justify-center mb-16">
        <Text className="text-2xl text-black font-bold">(로고)</Text>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity className="w-4/5 h-12 bg-[#FFDE03] rounded-md items-center justify-center mt-6" onPress={handleKakaoSignIn}>
        <Text className="text-xl text-white font-bold">로그인</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default LoginScreen;