import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import InterestSelector from '@/components/common/InterestSelector';
import { INTEREST_TAGS } from '@/constants/Tags';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateTags } from '@/services/templates';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

/**
 * 여행 템플릿에 적용될 태그를 선택하고 편집하는 화면입니다.
 */
const EditTemplateTagsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tagIds, setTagIds } = useTemplateDetails();

  const [isSaving, setIsSaving] = useState(false);

  /**
   * 선택된 태그 목록을 서버에 저장하고, 로컬 컨텍스트 상태를 업데이트합니다.
   */
  const handleSave = async (selectedTags: number[]) => {
    setIsSaving(true);
    try {
      const _id = +id;
      await setTemplateTags(_id, selectedTags);
      setTagIds(selectedTags);

      console.log(`Saved tags for template ${id}:`, selectedTags);
      router.back();
    } catch (error) {
      console.error('태그 업데이트 실패:', error);
      Toast.show({ type: 'error', text1: '태그 업데이트 실패' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-white'>
        <TouchableOpacity
          className='absolute left-5 top-10 w-10 h-10 rounded-full bg-white/90 items-center justify-center z-10'
          onPress={() => router.back()}
          accessibilityRole='button'
          accessibilityLabel='뒤로가기'
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <InterestSelector
          header={
            <>
              <Text className='text-2xl text-black text-left w-4/5 mb-1'>
                템플릿 태그 설정
              </Text>
              <Text className='text-base text-darkgray text-left w-4/5 mb-8'>
                최대 5개까지 설정 가능합니다.
              </Text>
            </>
          }
          buttonText='저장'
          availableTags={INTEREST_TAGS}
          initialSelectedTags={tagIds}
          maxSelection={5}
          onSubmit={handleSave}
          isSaving={isSaving}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default EditTemplateTagsScreen;
