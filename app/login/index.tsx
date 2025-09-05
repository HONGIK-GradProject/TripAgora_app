import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const LoginScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* 로고 */}
      <View className="w-[133px] h-[133px] rounded-full bg-[#D9D9D9] items-center justify-center mb-16">
        <Text className="text-2xl text-black font-bold">(로고)</Text>
      </View>

      {/* 로그인 버튼 */}
      <Link href="/login/set-profile" asChild>
        <TouchableOpacity className="w-4/5 h-12 bg-[#FFDE03] rounded-md items-center justify-center mt-6">
          <Text className="text-xl text-white font-bold">로그인</Text>
        </TouchableOpacity>
      </Link>
      
    </View>
  );
};

export default LoginScreen;
