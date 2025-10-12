import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { updateSession } from '@/services/sessions';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * 모집 정보를 수정하는 화면입니다.
 * 모집 인원과 시작 날짜를 수정할 수 있습니다.
 */
const EditRecruitmentContent: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // 세션 상세 정보 가져오기
  const sessionDetails = useSessionDetails();
  const {
    title = '',
    regionIds = [],
    imageUrls = [],
    maxParticipants = 0,
    startDate = '',
    isLoading = true,
    refetch = () => {},
  } = sessionDetails || {};

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // regionIds를 지역명으로 변환
  const regionNames = regionIds
    ? regionIds
        .map((id: number) => REGION_ID_TO_NAME_MAP[id] || `지역 ${id}`)
        .join(', ')
    : '지역 정보 없음';

  // 수정 가능한 상태
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [memberCount, setMemberCount] = useState(maxParticipants);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 세션 데이터가 로드되면 초기값 설정
  useEffect(() => {
    if (startDate) {
      setSelectedDate(new Date(startDate));
    }
    setMemberCount(maxParticipants);
  }, [startDate, maxParticipants]);

  const handleIncreaseMembers = () => {
    setMemberCount((prev) => prev + 1);
  };

  const handleDecreaseMembers = () => {
    setMemberCount((prev) => Math.max(prev - 1, 1));
  };

  const handleMemberCountChange = (text: string) => {
    const value = parseInt(text) || 1;
    setMemberCount(Math.max(value, 1));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleSaveChanges = async () => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: '세션 ID가 없습니다.',
      });
      return;
    }

    setIsUpdating(true);
    try {
      // 날짜를 API 형식으로 변환 (yyyy-mm-dd)
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const success = await updateSession(
        parseInt(id),
        memberCount,
        formattedDate
      );

      if (success) {
        Toast.show({
          type: 'success',
          text1: '모집 정보가 수정되었습니다.',
        });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: '모집 정보 수정에 실패했습니다.',
        });
      }
    } catch (error) {
      console.error('세션 수정 에러:', error);
      Toast.show({
        type: 'error',
        text1: '모집 정보 수정에 실패했습니다.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <View className='flex-1 bg-white items-center justify-center'>
        <ActivityIndicator size='large' color='#8130FF' />
        <Text className='text-gray-500 text-lg mt-4'>로딩 중...</Text>
      </View>
    );
  }

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
                모집 인원: {maxParticipants}명
              </Text>
            </View>
            <View className='flex-row items-center'>
              <Ionicons name='calendar-outline' size={20} color='#8130FF' />
              <Text className='text-base text-black ml-3'>
                시작 날짜:{' '}
                {startDate ? formatDate(new Date(startDate)) : '날짜 정보 없음'}
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
            <TextInput
              className='text-lg font-semibold text-black min-w-[60px] text-center border border-gray-300 rounded-lg py-2'
              value={memberCount.toString()}
              onChangeText={handleMemberCountChange}
              keyboardType='numeric'
              selectTextOnFocus
            />
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
          className={`h-[52px] rounded-lg items-center justify-center ${
            isUpdating ? 'bg-gray-400' : 'bg-[#8130FF]'
          }`}
          onPress={handleSaveChanges}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-lg font-bold text-white'>수정 완료하기!</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EditRecruitmentScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View className='flex-1 bg-white items-center justify-center'>
        <Text className='text-gray-500 text-lg'>세션 ID가 없습니다.</Text>
      </View>
    );
  }

  return (
    <SessionDetailsProvider id={id}>
      <EditRecruitmentContent />
    </SessionDetailsProvider>
  );
};

export default EditRecruitmentScreen;
