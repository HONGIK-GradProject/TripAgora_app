import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import InterestTag from '@/components/InterestTag';
import { INTEREST_TAGS } from '@/constants/Tags';
import Toast from 'react-native-toast-message';
const SetInterestsScreen: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  /// selectedTags 디버깅용. 사용 시 useEffect import 필요
  // useEffect(() => {
  //   console.log(selectedTags);
  // }, [selectedTags]);
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: '닉네임은 2~20자 이내로 입력해주세요.',
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const handleToggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleStart = () => {
    if (selectedTags.length < 3) {
      showToast();
      return;
    }
    // TODO: 서버에 태그 전송 로직 추가
    console.log('선택된 태그 ID:', selectedTags);
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
        {INTEREST_TAGS.map((tag, index) => {
          const tagId = index + 1;
          return (
            <InterestTag
              key={tag}
              tag={tag}
              isSelected={selectedTags.includes(tagId)}
              onPress={() => handleToggleTag(tagId)}
            />
          );
        })}
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
