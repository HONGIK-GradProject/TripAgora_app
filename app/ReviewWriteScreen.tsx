import { reviewsApi } from '@/api/reviews';
import { getSession } from '@/services/sessions';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionImageUrl, setSessionImageUrl] = useState('');
  const [guideNickname, setGuideNickname] = useState('');
  const [guideProfileImageUrl, setGuideProfileImageUrl] = useState('');

  // 세션 정보 로드
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const sessionData = await getSession(parseInt(sessionId));
        if (sessionData) {
          setSessionTitle(sessionData.title);
          setSessionImageUrl(sessionData.imageUrls?.[0] || '');

          // 가이드 정보 찾기
          const guide = sessionData.participants.find(
            (p) => p.role === 'GUIDE'
          );
          if (guide) {
            setGuideNickname(guide.nickname);
            setGuideProfileImageUrl(guide.profileImageUrl);
          }
        }
      } catch (error) {
        console.error('세션 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId]);

  // 별점 설정 (1-5개만 가능)
  const handleStarPress = (starCount: number) => {
    setRating(starCount);
  };

  // 리뷰 제출
  const handleSubmitReview = async () => {
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
        onPress: async () => {
          if (!sessionId) {
            Toast.show({
              type: 'error',
              text1: '세션 정보를 찾을 수 없습니다.',
            });
            return;
          }

          try {
            setIsSubmitting(true);
            const response = await reviewsApi.createReview(
              parseInt(sessionId),
              reviewText,
              rating
            );

            if (response.code === 200 || response.code === 0) {
              Toast.show({
                type: 'success',
                text1: '리뷰가 작성되었습니다',
                text2: '소중한 후기 감사합니다.',
              });
              router.back();
            }
          } catch (error) {
            console.error('리뷰 작성 에러:', error);
            Toast.show({
              type: 'error',
              text1: '리뷰 작성에 실패했습니다',
              text2: '잠시 후 다시 시도해주세요.',
            });
          } finally {
            setIsSubmitting(false);
          }
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
            {isLoading ? (
              <View className='w-full h-48 rounded-xl bg-gray-200 mb-4 overflow-hidden items-center justify-center'>
                <ActivityIndicator size='large' color='#8130FF' />
              </View>
            ) : sessionImageUrl ? (
              <View className='w-full h-48 rounded-xl mb-4 overflow-hidden'>
                <Image
                  source={{ uri: sessionImageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit='cover'
                />
              </View>
            ) : (
              <View className='w-full h-48 rounded-xl bg-gray-200 mb-4 overflow-hidden items-center justify-center'>
                <Ionicons name='image-outline' size={48} color='#9CA3AF' />
                <Text className='text-base text-gray-400 mt-3'>
                  대표 이미지 없음
                </Text>
              </View>
            )}

            {/* 여행 제목 */}
            <Text className='text-2xl font-bold text-center mb-4'>
              {isLoading ? '로딩 중...' : sessionTitle || '제목 없음'}
            </Text>

            {/* 가이드 정보 */}
            <View className='flex-row items-center justify-center'>
              {isLoading ? (
                <View className='w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3' />
              ) : guideProfileImageUrl ? (
                <Image
                  source={{ uri: guideProfileImageUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  contentFit='cover'
                />
              ) : (
                <View className='w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3'>
                  <Ionicons name='person-outline' size={20} color='#7C3AED' />
                </View>
              )}
              <Text className='text-lg text-gray-700 ml-3'>
                {isLoading
                  ? '로딩 중...'
                  : guideNickname
                  ? `${guideNickname} 가이드`
                  : '가이드'}
              </Text>
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
            rating === 0 || !reviewText.trim() || isSubmitting
              ? 'bg-gray-300'
              : 'bg-primary'
          }`}
          onPress={handleSubmitReview}
          disabled={rating === 0 || !reviewText.trim() || isSubmitting}
        >
          <Text
            className={`text-lg font-bold ${
              rating === 0 || !reviewText.trim() || isSubmitting
                ? 'text-gray-500'
                : 'text-white'
            }`}
          >
            {isSubmitting ? '작성 중...' : '작성 완료하기'}
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
