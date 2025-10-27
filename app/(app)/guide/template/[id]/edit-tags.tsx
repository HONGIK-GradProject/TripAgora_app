import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import InterestTag from '@/components/InterestTag';
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

  const [selectedTags, setSelectedTags] = useState<number[]>(tagIds);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: '태그는 5개 이하여야 합니다.',
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  /**
   * 특정 태그 ID를 선택 목록에 추가하거나 제거합니다 (토글).
   * @param tagId - 토글할 태그의 ID
   */
  const handleToggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  /**
   * 선택된 태그 목록을 서버에 저장하고, 로컬 컨텍스트 상태를 업데이트합니다.
   */
  const handleSave = async () => {
    if (selectedTags.length > 5) {
      showToast();
      return;
    }
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
    <View className='flex-1 items-center bg-white pt-20'>
      <TouchableOpacity
        className='absolute left-5 top-10 w-10 h-10 rounded-full bg-white/90 items-center justify-center'
        onPress={() => router.back()}
        accessibilityRole='button'
        accessibilityLabel='뒤로가기'
      >
        <Ionicons name='arrow-back' size={24} color='#000' />
      </TouchableOpacity>
      <Text className='text-2xl text-black text-left w-4/5 mb-1'>
        템플릿 태그 설정
      </Text>
      <Text className='text-base text-darkgray text-left w-4/5 mb-8'>
        최대 5개까지 설정 가능합니다.
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
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text className='text-xl font-bold text-white'>저장</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditTemplateTagsScreen;
