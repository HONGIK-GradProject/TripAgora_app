import { Region, REGION_DATA, REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateRegions } from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditTemplateRegionScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { regionIds, setRegionIds } = useTemplateDetails();

  const parents = useMemo(() => Object.keys(REGION_DATA), []);
  const [selectedParent, setSelectedParent] = useState<string>(parents[0]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>(regionIds);

  

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

  const toggleRegionId = (id: number) => {
    setSelectedRegionIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    // TODO: 선택된 지역 ID들(selectedRegionIds)을 템플릿에 반영하는 로직 연결
    // 예: await updateTemplateRegions({ templateId: id, regionIds: selectedRegionIds })
    const _id : number = +id;
    try {
      await setTemplateRegions(_id, selectedRegionIds);
      setRegionIds(selectedRegionIds);
    } catch (error) {
      console.error(error);
    } finally {
      router.back();
    }
  };

  return (
    <View className='flex-1 bg-white'>
      {/* Top bar */}
      <View className='pt-12 pb-3 px-5 flex-row items-center justify-between border-b border-[#E9E9E9]'>
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
            className='flex-row items-center px-3 py-1 rounded-full bg-[#F3ECFF]'
          >
            <Text className='text-[#8130FF] mr-1'>{region.name}</Text>
            <TouchableOpacity onPress={() => toggleRegionId(region.id)}>
              <Ionicons name='close' size={16} color='#8130FF' />
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
                    active ? 'bg-[#F3ECFF]' : 'bg-white'
                  }`}
                  onPress={() => {
                    setSelectedParent(p);
                  }}
                >
                  <Text
                    className={`text-base ${
                      active ? 'text-[#8130FF] font-semibold' : 'text-black'
                    }`}
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
                    active ? 'bg-purple-100' : 'bg-white'
                  }`}
                  onPress={() => toggleRegionId(c.id)}
                >
                  <Text
                    className={`text-base ${
                      active ? 'text-primary font-semibold' : 'text-black'
                    }`}
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
          disabled={selectedRegionIds.length === 0}
        >
          <Text className='text-white text-base font-bold'>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTemplateRegionScreen;
