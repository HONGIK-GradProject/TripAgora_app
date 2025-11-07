import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Text } from 'react-native';

import { usersApi } from '@/api/users';
import InterestSelector from '@/components/common/InterestSelector';
import { INTEREST_TAGS } from '@/constants/Tags';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const SetInterestsScreen: React.FC = () => {
  const { refreshUser } = useAuth();

  const handleStart = async (selectedTags: number[]) => {
    try {
      await usersApi.setTags(selectedTags);
      await refreshUser();
      router.replace('/(app)/traveler/home');
    } catch (error) {
      console.error('태그 업데이트 실패:', error);
      Toast.show({ type: 'error', text1: '태그 업데이트 실패' });
    }
  };

  return (
    <CustomSafeAreaView>
      <InterestSelector
        header={
          <>
            <Text className='text-2xl text-black text-left w-4/5 mb-1'>
              좋아하는 컨텐츠
            </Text>
            <Text className='text-2xl text-black text-left w-4/5 mb-10'>
              또는 분위기를 선택해 주세요.
            </Text>
            <Text className='text-base text-darkgray text-left w-4/5 mb-8'>
              (최소 3개)
            </Text>
          </>
        }
        buttonText='시작하기'
        availableTags={INTEREST_TAGS}
        minSelection={3}
        onSubmit={handleStart}
      />
    </CustomSafeAreaView>
  );
};

export default SetInterestsScreen;
