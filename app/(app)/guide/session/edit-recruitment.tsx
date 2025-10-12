import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * 모집 정보를 수정하는 화면입니다.
 * 모집 인원과 시작 날짜를 수정할 수 있습니다.
 */
const EditRecruitmentScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // TODO: API 연동 후 실제 데이터로 교체
  const sampleData = {
    title: id === '1' ? '홍대 1박2일 모임' : '후쿠오카 놀러가실분',
    regionIds: id === '1' ? [1] : [2], // 1: 홍대, 2: 후쿠오카
    imageUrls: [
      id === '1'
        ? 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        : 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    ],
    // 현재 모집 정보 (API에서 가져와야 함)
    currentMemberCount: 4,
    currentStartDate: new Date('2024-03-15'),
  };

  const title = sampleData.title;
  const regionIds = sampleData.regionIds;
  const imageUrls = sampleData.imageUrls;
  const currentMemberCount = sampleData.currentMemberCount;
  const currentStartDate = sampleData.currentStartDate;

  // regionIds를 지역명으로 변환
  const regionNames = regionIds
    ? regionIds
        .map((id) => REGION_ID_TO_NAME_MAP[id] || `지역 ${id}`)
        .join(', ')
    : '지역 정보 없음';

  // 수정 가능한 상태
  const [selectedDate, setSelectedDate] = useState<Date>(currentStartDate);
  const [memberCount, setMemberCount] = useState(currentMemberCount);
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

  const handleSaveChanges = () => {
    // TODO: 모집 정보 수정 API 호출
    console.log('모집 정보 수정:', {
      recruitmentId: id,
      selectedDate,
      memberCount,
    });
    // 수정 완료 후 이전 페이지로 이동
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
          <Text className='text-lg font-bold text-black'>모집 수정하기</Text>
          <View className='w-10' />
        </View>

        {/* 메인 제목 */}
        <View className='px-5 mb-5 pt-5'>
          <Text className='text-xl font-bold text-[#8130FF]'>
            모집 정보를 수정해요
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

        {/* 현재 모집 정보 표시 */}
        <View className='px-5 mb-6'>
          <Text className='text-lg font-bold text-[#8130FF] mb-4'>
            현재 모집 정보
          </Text>
          <View className='bg-[#F8F9FA] rounded-2xl p-4'>
            <View className='flex-row items-center mb-3'>
              <Ionicons name='people-outline' size={20} color='#8130FF' />
              <Text className='text-base text-black ml-3'>
                모집 인원: {currentMemberCount}명
              </Text>
            </View>
            <View className='flex-row items-center'>
              <Ionicons name='calendar-outline' size={20} color='#8130FF' />
              <Text className='text-base text-black ml-3'>
                시작 날짜: {formatDate(currentStartDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* 모집 인원 수정 */}
        <View className='px-5 mb-8'>
          <Text className='text-lg font-bold text-[#8130FF] mb-4'>
            모집 인원 수정
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

        {/* 날짜 수정 */}
        <View className='px-5 mb-[100px]'>
          <Text className='text-lg font-bold text-[#8130FF] mb-4'>
            시작 날짜 수정하기
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
          onPress={handleSaveChanges}
        >
          <Text className='text-lg font-bold text-white'>수정 완료하기!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditRecruitmentScreen;
