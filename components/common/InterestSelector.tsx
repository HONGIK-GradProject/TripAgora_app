import InterestTag from '@/components/InterestTag';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface InterestSelectorProps {
  header?: React.ReactNode;
  buttonText: string;
  availableTags: { id: number; name: string }[];
  onSubmit: (selectedTags: number[]) => Promise<void> | void;
  isSaving?: boolean;
  minSelection?: number;
  maxSelection?: number;
  initialSelectedTags?: number[];
  noTopPadding?: boolean;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  header,
  buttonText,
  availableTags,
  onSubmit,
  isSaving = false,
  minSelection,
  maxSelection,
  initialSelectedTags = [],
  noTopPadding = false,
}) => {
  const [selectedTags, setSelectedTags] =
    useState<number[]>(initialSelectedTags);

  const handleToggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    if (isSaving) return;

    if (minSelection && selectedTags.length < minSelection) {
      Toast.show({
        type: 'error',
        text1: `태그를 ${minSelection}개 이상 선택해 주세요.`,
        position: 'bottom',
        bottomOffset: 100,
      });
      return;
    }
    if (maxSelection && selectedTags.length > maxSelection) {
      Toast.show({
        type: 'error',
        text1: `태그는 ${maxSelection}개까지 선택할 수 있습니다.`,
        position: 'bottom',
        bottomOffset: 100,
      });
      return;
    }
    onSubmit(selectedTags);
  };

  return (
    <View
      className={`flex-1 items-center bg-white ${noTopPadding ? '' : 'pt-20'}`}
    >
      {header}

      <View className='flex-row flex-wrap justify-start w-4/5 mb-10'>
        {availableTags.map((tag) => (
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
        onPress={handleSubmit}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text className='text-xl font-bold text-white'>{buttonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InterestSelector;
