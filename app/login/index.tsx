import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import TripAgoraLogo from '@/components/common/TripAgoraLogo';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 로그인 화면을 렌더링하는 React 컴포넌트입니다.
 * 카카오 로그인 버튼을 포함합니다.
 */
const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  /**
   * 카카오 로그인 + 자체 로그인을 처리하는 함수입니다.
   */
  const handleSignIn = async () => {
    await signIn();
    router.replace('/');
  };

  return (
    <CustomSafeAreaView>
      <View className='flex-1 items-center justify-center bg-[#F0FAFF]'>
        {/* 로고 */}
        <View className='items-center mb-16'>
          <TripAgoraLogo size={350} />
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          className='w-4/5 h-12 bg-[#FFDE03] rounded-md items-center justify-center mt-6'
          onPress={handleSignIn}
        >
          <Text className='text-xl text-[#000000] font-bold'>
            카카오로 시작하기
          </Text>
        </TouchableOpacity>
      </View>
    </CustomSafeAreaView>
  );
};

export default LoginScreen;
