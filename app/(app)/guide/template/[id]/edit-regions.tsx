import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import {
  Region,
  REGION_DATA,
  REGION_ID_TO_NAME_MAP,
} from '@/constants/Regions';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateRegions } from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * 여행 템플릿에 적용될 지역을 선택하고 편집하는 화면입니다.
 */
const EditTemplateRegionsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { regionIds, setRegionIds } = useTemplateDetails();

  const parents = useMemo(() => Object.keys(REGION_DATA), []);
  const [selectedParent, setSelectedParent] = useState<string>(parents[0]);
  const [selectedRegionIds, setSelectedRegionIds] =
    useState<number[]>(regionIds);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (errorMessage?: string) => {
    Toast.show({
      type: 'error',
      text1: '지역 수정 중 오류가 발생했습니다.',
      text2: errorMessage || undefined,
    });
  };

  const children = useMemo<Region[]>(
    () => (selectedParent ? REGION_DATA[selectedParent] : []),
    [selectedParent]
  );

  // For displaying selected tags, use the efficient ID-to-name map
  const selectedRegions = useMemo(
    () =>
      selectedRegionIds.map((id) => ({
        id,
        name: REGION_ID_TO_NAME_MAP[id],
      })),
    [selectedRegionIds]
  );

  /**
   * 특정 지역 ID를 선택 목록에 추가하거나 제거합니다 (토글).
   * @param id - 토글할 지역의 ID
   */
  const toggleRegionId = (id: number) => {
    setSelectedRegionIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  /**
   * 선택된 지역 목록을 서버에 저장하고, 로컬 컨텍스트 상태를 업데이트합니다.
   */
  const handleSave = async () => {
    setIsSaving(true);
    const _id: number = +id;
    try {
      await setTemplateRegions(_id, selectedRegionIds);
      setRegionIds(selectedRegionIds);
      router.back();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : undefined;
      showToast(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-white'>
        {/* Top bar */}
        <View className='pt-6 pb-3 px-5 flex-row items-center justify-between border-b border-[#E9E9E9]'>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-white/90 items-center justify-center'
            onPress={() => router.back()}
            accessibilityRole='button'
            accessibilityLabel='뒤로가기'
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text className='text-lg font-bold text-black'>지역 선택</Text>
          <View className='w-10' />
        </View>

        {/* 선택된 태그 표시 */}
        <View className='flex-row flex-wrap px-5 py-3 gap-2 border-b border-[#E9E9E9]'>
          {selectedRegions.map((region) => (
            <View
              key={region.id}
              className='flex-row items-center px-3 py-1 rounded-full'
              style={{ backgroundColor: '#E6E9FF' }}
            >
              <Text className='mr-1' style={{ color: '#5B67F5' }}>
                {region.name}
              </Text>
              <TouchableOpacity onPress={() => toggleRegionId(region.id)}>
                <Ionicons name='close' size={16} color='#5B67F5' />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Content */}
        <View className='flex-1 flex-row'>
          {/* Parents */}
          <ScrollView className='w-1/3 border-r border-[#F0F0F0]'>
            <View className='py-2'>
              {parents.map((p) => {
                const active = p === selectedParent;
                return (
                  <TouchableOpacity
                    key={p}
                    className={`px-5 py-4 ${
                      active ? 'bg-[#E6E9FF]' : 'bg-white'
                    }`}
                    onPress={() => {
                      setSelectedParent(p);
                    }}
                  >
                    <Text
                      className={`text-base ${
                        active ? 'font-semibold' : 'text-black'
                      }`}
                      style={{ color: active ? '#5B67F5' : undefined }}
                    >
                      {p && p.length > 2 ? p.slice(0, -2) : p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Children */}
          <ScrollView className='w-2/3'>
            <View className='py-2'>
              {children.map((c) => {
                const active = selectedRegionIds.includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    className={`px-5 py-4 ${
                      active ? 'bg-[#E6E9FF]' : 'bg-white'
                    }`}
                    onPress={() => toggleRegionId(c.id)}
                  >
                    <Text
                      className={`text-base ${
                        active ? 'font-semibold' : 'text-black'
                      }`}
                      style={{ color: active ? '#5B67F5' : undefined }}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Bottom action */}
        <View className='px-5 pb-6 pt-3 border-t border-[#E9E9E9] bg-white'>
          <TouchableOpacity
            className={`w-full h-[52px] rounded-md items-center justify-center ${
              selectedRegionIds.length > 0 ? 'bg-primary' : 'bg-[#E5E5EA]'
            }`}
            onPress={handleSave}
            disabled={selectedRegionIds.length === 0 || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text className='text-white text-base font-bold'>저장</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default EditTemplateRegionsScreen;
