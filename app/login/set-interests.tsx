import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { usersApi } from '@/api/users';
import InterestTag from '@/components/InterestTag';
import { INTEREST_TAGS } from '@/constants/Tags';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
const SetInterestsScreen: React.FC = () => {
  const { refreshUser } = useAuth();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  /// selectedTags 디버깅용. 사용 시 useEffect import 필요
  // useEffect(() => {
  //   console.log(selectedTags);
  // }, [selectedTags]);
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: '태그를 3개 이상 선택해 주세요.',
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const handleToggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleStart = async () => {
    // 개수 제한 검사
    if (selectedTags.length < 3) {
      showToast();
      return;
    }
    // 태그 변경 요청
    try {
      await usersApi.setTags(selectedTags);
      await refreshUser();
      router.replace('/(app)/traveler/home');
      return true;
    } catch (error) {
      console.error('태그 업데이트 실패:', error);
      Toast.show({ type: 'error', text1: '태그 업데이트 실패' });
      return false;
    }
  };

  return (
    <View className='flex-1 items-center bg-white pt-20'>
      <Text className='text-2xl text-black text-left w-4/5 mb-1'>
        좋아하는 컨텐츠
      </Text>
      <Text className='text-2xl text-black text-left w-4/5 mb-10'>
        또는 분위기를 선택해 주세요.
      </Text>
      <Text className='text-base text-darkgray text-left w-4/5 mb-8'>
        (최소 3개)
      </Text>

      <View className='flex-row flex-wrap justify-start w-4/5 mb-10'>
        {INTEREST_TAGS.map((tag) => (
          <InterestTag
            key={tag.id}
            tag={tag.name}
            isSelected={selectedTags.includes(tag.id)}
            onPress={() => handleToggleTag(tag.id)}
          />
        ))}
      </View>

      <TouchableOpacity
        className='w-[390px] h-[52px] bg-primary rounded-md justify-center items-center absolute bottom-7'
        onPress={handleStart}
      >
        <Text className='text-xl font-bold text-white'>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetInterestsScreen;
