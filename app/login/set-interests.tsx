import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import InterestTag from '@/components/InterestTag';
import { INTEREST_TAGS } from '@/constants/Tags';

const SetInterestsScreen: React.FC = () => {
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
          <InterestTag key={tag} tag={tag} />
        ))}
      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity className='w-[390px] h-[52px] bg-primary rounded-md justify-center items-center absolute bottom-7'>
        <Text className='text-xl font-bold text-white'>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetInterestsScreen;
