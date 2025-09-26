import { REGION_DATA, Region } from '@/constants/Regions';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditTemplateLocationScreen: React.FC = () => {
  const parents = useMemo(() => Object.keys(REGION_DATA), []);
  const [selectedParent, setSelectedParent] = useState<string>(parents[0]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const children = useMemo<Region[]>(
    () => (selectedParent ? REGION_DATA[selectedParent] : []),
    [selectedParent]
  );

  const handleSave = () => {
    if (!selectedParent || !selectedChild) {
      // 선택이 미완료된 경우에는 단순히 뒤로가기만 합니다. 추후 검증/토스트 추가 가능.
      router.back();
      return;
    }
    // TODO: 선택된 지역(selectedParent, selectedChild)을 템플릿에 반영하는 로직 연결
    // 예: await updateTemplateLocation({ parent: selectedParent, child: selectedChild })
    router.back();
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

      {/* Content */}
      <View className='flex-1 flex-row'>
        {/* Parents */}
        <ScrollView className='w-1/2 border-r border-[#F0F0F0]'>
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
                    setSelectedChild(null);
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
        <ScrollView className='w-1/2'>
          <View className='py-2'>
            {children.map((c) => {
              const active = c.name === selectedChild;
              return (
                <TouchableOpacity
                  key={c.id}
                  className={`px-5 py-4 ${
                    active ? 'bg-[#F3ECFF]' : 'bg-white'
                  }`}
                  onPress={() => setSelectedChild(c.name)}
                >
                  <Text
                    className={`text-base ${
                      active ? 'text-[#8130FF] font-semibold' : 'text-black'
                    }`}
                  >
                    {c.name}
                  </Text>
                  {active ? (
                    <Text className='text-xs text-[#8130FF] mt-1'>
                      ID: {c.id}
                    </Text>
                  ) : null}
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
            selectedChild ? 'bg-primary' : 'bg-[#E5E5EA]'
          }`}
          onPress={handleSave}
          disabled={!selectedChild}
        >
          <Text className='text-white text-base font-bold'>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTemplateLocationScreen;
