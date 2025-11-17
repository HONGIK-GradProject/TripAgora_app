import { reviewsApi } from '@/api/reviews';
import CustomKeyboardAvoidingView from '@/components/CustomKeyboardAvoidingView';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionImageUrl, setSessionImageUrl] = useState('');
  const [guideNickname, setGuideNickname] = useState('');
  const [guideProfileImageUrl, setGuideProfileImageUrl] = useState('');
  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(null);

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
          setHasWrittenReview(sessionData.hasWrittenReview ?? false);

          // 가이드 정보 찾기
          const guide = sessionData.participants.find(
            (p) => p.role === 'GUIDE'
          );
          if (guide) {
            setGuideNickname(guide.nickname);
            setGuideProfileImageUrl(guide.profileImageUrl);
          }

          // 이미 작성한 리뷰가 있는 경우 리뷰 ID 조회
          if (sessionData.hasWrittenReview && sessionData.templateId && user) {
            try {
              const reviewsResponse = await reviewsApi.getReviewsByTemplate(
                sessionData.templateId
              );
              if (reviewsResponse.data?.review) {
                // 현재 사용자가 작성한 리뷰 찾기 (닉네임으로 비교)
                const myReview = reviewsResponse.data.review.find(
                  (review) => review.authorNickname === user.nickname
                );
                if (myReview) {
                  setReviewId(myReview.reviewId);
                  // 기존 리뷰 내용 불러오기
                  setRating(myReview.rating);
                  setReviewText(myReview.content);
                }
              }
            } catch (error) {
              console.error('리뷰 조회 실패:', error);
            }
          }
        }
      } catch (error) {
        console.error('세션 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId, user]);

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

    const alertTitle = hasWrittenReview ? '리뷰 수정' : '리뷰 작성';
    const alertMessage = hasWrittenReview
      ? '리뷰를 수정하시겠습니까?'
      : '리뷰를 작성하시겠습니까?';
    const confirmText = hasWrittenReview ? '수정' : '작성';

    Alert.alert(alertTitle, alertMessage, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: confirmText,
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
            let response;

            if (hasWrittenReview && reviewId) {
              // 리뷰 수정
              response = await reviewsApi.updateReview(
                reviewId,
                reviewText,
                rating
              );
            } else {
              // 리뷰 생성
              response = await reviewsApi.createReview(
                parseInt(sessionId),
                reviewText,
                rating
              );
            }

            if (response.code === 200 || response.code === 0) {
              Toast.show({
                type: 'success',
                text1: hasWrittenReview
                  ? '리뷰가 수정되었습니다'
                  : '리뷰가 작성되었습니다',
                text2: '소중한 후기 감사합니다.',
              });
              router.back();
            }
          } catch (error) {
            console.error('리뷰 처리 에러:', error);
            Toast.show({
              type: 'error',
              text1: hasWrittenReview
                ? '리뷰 수정에 실패했습니다'
                : '리뷰 작성에 실패했습니다',
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
    <CustomSafeAreaView>
      <CustomKeyboardAvoidingView>
        <View className='flex-1 bg-white'>
          {/* 상단 네비게이션 바 */}
          <View
            style={[
              styles.topBar,
              {
                paddingTop: insets.top + 4,
                paddingBottom: 12,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                zIndex: 5,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name='arrow-back' size={24} color='#000' />
            </TouchableOpacity>
            <Text style={styles.title}>
              {hasWrittenReview ? '리뷰 수정' : '리뷰 남기기'}
            </Text>
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
                    <ActivityIndicator size='large' color='#5B67F5' />
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
                    <View
                      className='w-10 h-10 rounded-full items-center justify-center mr-3'
                      style={{ backgroundColor: '#E6E9FF' }}
                    />
                  ) : guideProfileImageUrl ? (
                    <Image
                      source={{ uri: guideProfileImageUrl }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      contentFit='cover'
                    />
                  ) : (
                    <View
                      className='w-10 h-10 rounded-full items-center justify-center mr-3'
                      style={{ backgroundColor: '#E6E9FF' }}
                    >
                      <Ionicons
                        name='person-outline'
                        size={20}
                        color='#5B67F5'
                      />
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
                <Text
                  className='text-xl font-bold text-center mb-6'
                  style={{ color: '#5B67F5' }}
                >
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
                <Text
                  className='text-xl font-bold mb-4'
                  style={{ color: '#5B67F5' }}
                >
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

            {/* 작성 버튼 */}
            <View className='px-5 pb-10'>
              <TouchableOpacity
                className='rounded-xl py-4 items-center justify-center'
                style={{
                  backgroundColor:
                    rating === 0 || !reviewText.trim() || isSubmitting
                      ? '#D1D5DB'
                      : '#5B67F5',
                }}
                onPress={handleSubmitReview}
                disabled={rating === 0 || !reviewText.trim() || isSubmitting}
              >
                <Text
                  className='text-lg font-bold'
                  style={{
                    color:
                      rating === 0 || !reviewText.trim() || isSubmitting
                        ? '#6B7280'
                        : '#FFFFFF',
                  }}
                >
                  {isSubmitting
                    ? hasWrittenReview
                      ? '수정 중...'
                      : '작성 중...'
                    : hasWrittenReview
                    ? '수정 완료하기'
                    : '작성 완료하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </CustomKeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default ReviewWriteScreen;
