import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SetProfileScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const handleNicknameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    setNickname(filteredText);
  };

  useEffect(() => {
    console.log(nickname);
  }, [nickname]);

  const validateNickname = (name: string) => {
    if (name.length < 2 || name.length > 20) {
      Alert.alert('닉네임은 2~20자 이내로 입력해주세요.');
      return false;
    }
    // TODO: 로그인 요청
    console.log('닉네임:', name);
    return true;
  };

  const handleNextPress = () => {
    if (validateNickname(nickname)) {
      router.push('/login/set-interests');
    }
  };

  return (
    <View className='flex-1 items-center bg-white pt-20'>
      <Text className='text-4xl text-center mb-1 font-normal'>환영합니다!</Text>
      <Text className='text-4xl text-center mb-10 font-normal'>
        당신에 대해 알려주세요.
      </Text>

      <View className='w-[133px] h-[133px] rounded-full bg-secondary justify-center items-center mb-8'>
        <Image
          source={{ uri: 'https://via.placeholder.com/133' }}
          className='w-full h-full rounded-full absolute'
        />
        <Text className='text-2xl text-black'>(프사)</Text>
      </View>

      {/* 닉네임 인풋 */}
      <View className='w-4/5 mb-5'>
        <Text className='text-2xl text-black mb-2'>닉네임</Text>
        <TextInput
          className='w-full h-12 border-b border-black px-0'
          placeholder='2~20자 이내, 특수문자 및 공백 제외'
          value={nickname}
          onChangeText={handleNicknameChange}
        />
      </View>

      {/* 다음으로 버튼 */}
      <TouchableOpacity
        className='w-[390px] h-[52px] bg-primary rounded-md justify-center items-center absolute bottom-7'
        onPress={handleNextPress}
      >
        <Text className='text-xl font-bold text-white'>다음으로</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetProfileScreen;
