import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/**
 * 리뷰 작성 화면입니다.
 * 여행 후 가이드에 대한 별점과 리뷰를 작성할 수 있습니다.
 */
const ReviewWriteScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // 별점 설정 (1-5개만 가능)
  const handleStarPress = (starCount: number) => {
    setRating(starCount);
  };

  // 리뷰 제출
  const handleSubmitReview = () => {
    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: '별점을 선택해주세요',
      });
      return;
    }

    if (!reviewText.trim()) {
      Toast.show({
        type: 'error',
        text1: '리뷰 내용을 입력해주세요',
      });
      return;
    }

    Alert.alert('리뷰 작성', '리뷰를 작성하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '작성',
        onPress: () => {
          // TODO: 실제 리뷰 작성 API 호출
          Toast.show({
            type: 'success',
            text1: '리뷰가 작성되었습니다',
            text2: '소중한 후기 감사합니다.',
          });
          router.back();
        },
      },
    ]);
  };

  return (
    <View className='flex-1 bg-white pt-12 relative'>
      {/* 상단 네비게이션 바 */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.title}>리뷰 남기기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 여행 정보 섹션 */}
        <View className='px-5 mb-6'>
          {/* 여행 정보 카드 */}
          <View className='bg-white rounded-2xl p-5 border border-gray-200 shadow-sm'>
            {/* 여행 이미지 */}
            <View className='w-full h-48 rounded-xl bg-gray-200 mb-4 overflow-hidden items-center justify-center'>
              <Ionicons name='image-outline' size={48} color='#9CA3AF' />
              <Text className='text-base text-gray-400 mt-3'>
                대표 이미지 없음
              </Text>
            </View>

            {/* 여행 제목 */}
            <Text className='text-2xl font-bold text-center mb-4'>
              홍대 1박2일 모임
            </Text>

            {/* 가이드 정보 */}
            <View className='flex-row items-center justify-center'>
              <View className='w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3'>
                <Text className='text-lg font-bold text-purple-700'>피</Text>
              </View>
              <Text className='text-lg text-gray-700'>피 카소 가이드</Text>
            </View>
          </View>
        </View>

        {/* 별점 섹션 */}
        <View className='px-5 mb-6'>
          <View className='bg-white rounded-2xl p-5 border border-gray-200 shadow-sm'>
            <Text className='text-xl font-bold text-center mb-6 text-primary'>
              여행 즐거우셨나요?
            </Text>
            <View className='flex-row justify-center items-center'>
              {[1, 2, 3, 4, 5].map((starCount) => (
                <TouchableOpacity
                  key={starCount}
                  className='p-2'
                  onPress={() => handleStarPress(starCount)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={starCount <= rating ? 'star' : 'star-outline'}
                    size={45}
                    color={starCount <= rating ? '#FF9E30' : '#E5E5E5'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 리뷰 작성 섹션 */}
        <View className='px-5 mb-6'>
          <View className='bg-white rounded-2xl p-5 border border-gray-200 shadow-sm'>
            <Text className='text-xl font-bold mb-4 text-primary'>
              간단한 한줄평을 작성해주세요
            </Text>
            <View className='bg-gray-50 rounded-xl border border-gray-200 p-4 relative min-h-32'>
              <TextInput
                className='text-base text-gray-900 flex-1 min-h-24'
                value={reviewText}
                onChangeText={setReviewText}
                placeholder='여행에 대한 후기를 작성해주세요...'
                placeholderTextColor='#999999'
                multiline
                textAlignVertical='top'
                maxLength={200}
              />
              <Text className='absolute bottom-2 right-3 text-xs text-gray-400'>
                {reviewText.length}/200
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 작성 버튼 */}
      <View className='absolute bottom-0 left-0 right-0 bg-white px-5 py-5 border-t border-gray-200'>
        <TouchableOpacity
          className={`rounded-xl py-4 items-center justify-center ${
            rating === 0 || !reviewText.trim() ? 'bg-gray-300' : 'bg-primary'
          }`}
          onPress={handleSubmitReview}
          disabled={rating === 0 || !reviewText.trim()}
        >
          <Text
            className={`text-lg font-bold ${
              rating === 0 || !reviewText.trim()
                ? 'text-gray-500'
                : 'text-white'
            }`}
          >
            작성 완료하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingTop: 80, // 상단 바 공간 확보
    paddingBottom: 120, // 하단 버튼 공간 확보
  },
});

export default ReviewWriteScreen;
