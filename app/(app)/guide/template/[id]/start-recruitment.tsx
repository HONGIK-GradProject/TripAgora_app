import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TemplateDetailsProvider } from '@/contexts/TemplateDetailsProvider';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const StartRecruitmentContent: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // 템플릿 상세 정보 가져오기
  const { title, regionIds, imageUrls, refetch } = useTemplateDetails();

  // regionIds를 지역명으로 변환
  const regionNames = regionIds
    ? regionIds
        .map((id) => REGION_ID_TO_NAME_MAP[id] || `지역 ${id}`)
        .join(', ')
    : '지역 정보 없음';

  // 컴포넌트 마운트 시 템플릿 데이터 가져오기
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  // 시작 일자만 백에 보내면 종료 일자는 알아서 처리된다고 합니다.
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [memberCount, setMemberCount] = useState(4);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleIncreaseMembers = () => {
    setMemberCount((prev) => Math.min(prev + 1, 10));
  };

  const handleDecreaseMembers = () => {
    setMemberCount((prev) => Math.max(prev - 1, 1));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleStartRecruitment = () => {
    // TODO: 모집 시작 로직 구현
    console.log('모집 시작:', {
      templateId: id,
      selectedDate,
      memberCount,
    });
    // 모집 완료 후 적절한 페이지로 이동
    router.back();
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* 상단 네비게이션 */}
        <View className='pt-12 pb-3 px-5 flex-row items-center justify-between border-b border-[#E9E9E9]'>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-white/90 items-center justify-center'
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text className='text-lg font-bold text-black'>모집 시작하기</Text>
          <View className='w-10' />
        </View>

        {/* 메인 제목 */}
        <View className='px-5 mb-5 pt-5'>
          <Text className='text-xl font-bold text-[#8130FF]'>
            이 여행으로 모집을 시작해요
          </Text>
        </View>

        {/* 여행 정보 섹션 */}
        <View className='px-5 mb-5'>
          <View className='flex-row items-center bg-white rounded-lg p-0'>
            <View className='w-20 h-20 rounded-lg mr-4'>
              {hasImageError || !imageUrls || imageUrls.length === 0 ? (
                <View className='w-20 h-20 rounded-lg bg-gray-300 items-center justify-center'>
                  <Ionicons name='image-outline' size={24} color='#9CA3AF' />
                </View>
              ) : (
                <Image
                  source={{ uri: imageUrls[0] }}
                  className='w-20 h-20 rounded-lg'
                  onError={() => setHasImageError(true)}
                />
              )}
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-bold text-black mb-2'>{title}</Text>
              <View className='flex-row items-center'>
                <Ionicons name='location-outline' size={16} color='#999' />
                <Text className='text-base text-black ml-2'>{regionNames}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 모집 인원 설정 */}
        <View className='px-5 mb-8'>
          <Text className='text-lg font-bold text-[#8130FF] mb-4'>
            모집 인원
          </Text>
          <View className='flex-row items-center justify-center gap-5'>
            <TouchableOpacity
              className='w-12 h-12 rounded-full bg-[#F3ECFF] items-center justify-center'
              onPress={handleDecreaseMembers}
            >
              <Ionicons name='remove' size={24} color='#613EEA' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-black min-w-[40px] text-center'>
              {memberCount}
            </Text>
            <TouchableOpacity
              className='w-12 h-12 rounded-full bg-[#F3ECFF] items-center justify-center'
              onPress={handleIncreaseMembers}
            >
              <Ionicons name='add' size={24} color='#613EEA' />
            </TouchableOpacity>
          </View>
        </View>

        {/* 날짜 설정 */}
        <View className='px-5 mb-[100px]'>
          <Text className='text-lg font-bold text-[#8130FF] mb-4'>
            시작 날짜 설정하기
          </Text>
          <TouchableOpacity
            className='bg-[#F3ECFF] rounded-2xl border border-[#D9C7FF] mt-5'
            onPress={showDatePickerModal}
          >
            <View className='flex-row items-center p-4'>
              <Ionicons name='calendar-outline' size={24} color='#613EEA' />
              <View className='flex-1 ml-3'>
                <Text className='text-sm text-[#8130FF] font-medium mb-1'>
                  여행 날짜
                </Text>
                <Text className='text-base text-black font-semibold'>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* 하단 버튼 */}
      <View className='absolute bottom-0 left-0 right-0 px-5 pt-[10px] pb-5 bg-white border-t border-[#E9E9E9]'>
        <TouchableOpacity
          className='h-[52px] rounded-lg items-center justify-center bg-[#8130FF]'
          onPress={handleStartRecruitment}
        >
          <Text className='text-lg font-bold text-white'>모집 시작하기!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StartRecruitmentScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!id) {
    return null;
  }

  return (
    <TemplateDetailsProvider id={id}>
      <StartRecruitmentContent />
    </TemplateDetailsProvider>
  );
};

export default StartRecruitmentScreen;
