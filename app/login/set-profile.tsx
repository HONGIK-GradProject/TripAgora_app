import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SetProfileScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');

  const handleNicknameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    setNickname(filteredText);
  };

  return (
    <View className="flex-1 items-center bg-white pt-20">
      <Text className="text-4xl text-center mb-1 font-normal">환영합니다!</Text>
      <Text className="text-4xl text-center mb-10 font-normal">당신에 대해 알려주세요.</Text>

      <View className="w-[133px] h-[133px] rounded-full bg-secondary justify-center items-center mb-8">
        <Image source={{ uri: 'https://via.placeholder.com/133' }} className="w-full h-full rounded-full absolute" />
        <Text className="text-2xl text-black">(프사)</Text>
      </View>

      {/* 닉네임 인풋 */}
      <View className="w-4/5 mb-5">
        <Text className="text-2xl text-black mb-2">닉네임</Text>
        <TextInput
          className="w-full h-12 border-b border-black px-0"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={handleNicknameChange}
        />
      </View>

      {/* 다음으로 버튼 */}
      <Link href="/login/set-interests" asChild>
        <TouchableOpacity className="w-[390px] h-[52px] bg-primary rounded-md justify-center items-center absolute bottom-7">
          <Text className="text-xl font-bold text-white">다음으로</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default SetProfileScreen;
