import { reviewsApi } from '@/api/reviews';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import {
  cancelParticipation,
  closeSession,
  createParticipation,
  deleteSession,
} from '@/services/sessions';
import { ReviewData, ReviewGetByTemplateData } from '@/types/reviews';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface SessionDetailScreenProps {
  userType: 'guide' | 'traveler';
}

// 상수
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * 세션 상세 정보를 보여주는 공통 화면입니다.
 * 가이드와 여행자 모두 사용할 수 있으며, userType에 따라 다른 기능을 제공합니다.
 */
const SessionDetailContent: React.FC<SessionDetailScreenProps> = ({
  userType,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 세션 상세 정보 가져오기
  const sessionDetails = useSessionDetails();
  const {
    templateId = 0,
    title = '',
    content = '',
    regionIds = [],
    tagIds = [],
    imageUrls = [],
    maxParticipants = 0,
    currentParticipants = 0,
    startDate = '',
    endDate = '',
    status = '',
    participants = [],
    isParticipating: contextIsParticipating = false,
    itineraries = {},
    isLoading = true,
    refetch = () => {},
  } = sessionDetails || {};

  // 가이드만 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (userType === 'guide') {
        refetch();
      }
    }, [refetch, userType])
  );

  // 참여 신청 상태 관리 (여행자용)
  const [isParticipating, setIsParticipating] = useState(
    contextIsParticipating
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 리뷰 데이터 상태
  const [reviewData, setReviewData] = useState<ReviewGetByTemplateData | null>(
    null
  );
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // 컨텍스트의 isParticipating 상태가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setIsParticipating(contextIsParticipating);
  }, [contextIsParticipating]);

  // 가이드 정보 가져오기
  const guide = useMemo(() => {
    return participants.find((p) => p.role === 'GUIDE');
  }, [participants]);

  // 템플릿 리뷰 데이터 로드
  useEffect(() => {
    const loadReviews = async () => {
      if (!templateId || templateId === 0) return;

      try {
        setIsLoadingReviews(true);
        const response = await reviewsApi.getReviewsByTemplate(templateId);
        if (response.data) {
          const { averageRating = 0, totalReviewCount = 0 } = response.data;
          const rawReviews =
            (response.data as any)?.review ??
            (response.data as any)?.reviews ??
            (response.data as any)?.reviewList ??
            [];

          const normalizedReviews = Array.isArray(rawReviews) ? rawReviews : [];

          const mappedReviews = (
            normalizedReviews as (Partial<ReviewData> & Record<string, any>)[]
          ).map((review) => {
            const fallbackProfile =
              review.authorProfile ??
              review.authorProfileUrl ??
              review.authorProfileImageUrl ??
              review.profileImageUrl ??
              review.profileImage ??
              '';

            return {
              ...review,
              authorProfile: fallbackProfile,
            } as ReviewData;
          });

          setReviewData({
            averageRating,
            totalReviewCount:
              typeof totalReviewCount === 'number'
                ? totalReviewCount
                : mappedReviews.length,
            review: mappedReviews,
          });
        } else {
          setReviewData({
            averageRating: 0,
            totalReviewCount: 0,
            review: [],
          });
        }
      } catch (error) {
        console.error('리뷰 로드 실패:', error);
        // 에러가 발생해도 UI는 계속 표시
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [templateId]);

  // 이미지 관련 상태
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null);

  // 섹션 네비게이션 관련 상태
  const sectionRefs = {
    info: React.useRef<View>(null),
    itinerary: React.useRef<View>(null),
    review: React.useRef<View>(null),
    participants: React.useRef<View>(null),
  };
  const mainScrollViewRef = React.useRef<ScrollView>(null);

  // 지역명과 태그명 변환
  const regionNames = useMemo(() => {
    return regionIds.map(
      (id: number) => REGION_ID_TO_NAME_MAP[id] || '알 수 없는 지역'
    );
  }, [regionIds]);

  const tagNames = useMemo(() => {
    return tagIds.map(
      (id: number) => TAG_ID_TO_NAME_MAP[id] || '알 수 없는 태그'
    );
  }, [tagIds]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  // 일정 관련 상태
  const availableDays = useMemo(
    () =>
      Object.keys(itineraries)
        .map(Number)
        .sort((a, b) => a - b),
    [itineraries]
  );

  const [selectedDay, setSelectedDay] = useState(
    availableDays.length > 0 ? availableDays[0] : 1
  );

  useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  // 여행자용 참여 신청 처리
  const handleParticipation = useCallback(async () => {
    if (!id) return;

    Alert.alert('참여 신청', '이 여행에 참여 신청하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '신청',
        onPress: async () => {
          try {
            setIsSubmitting(true);
            const result = await createParticipation(parseInt(id));

            if (result) {
              setIsParticipating(true);
              refetch(); // 세션 정보 새로고침
              Toast.show({
                type: 'success',
                text1: '참여 신청 완료',
                text2: '여행에 성공적으로 참여 신청되었습니다.',
              });
            }
          } catch (error) {
            console.error('참여 신청 에러:', error);
            Toast.show({
              type: 'error',
              text1: '참여 신청 실패',
              text2: '본인의 세션 또는 이미 신청한 세션입니다',
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  }, [id, refetch]);

  // 여행자용 참여 취소 처리
  const handleCancelParticipation = useCallback(async () => {
    if (!id) return;

    Alert.alert('참여 취소', '정말로 참여 신청을 취소하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsSubmitting(true);
            const result = await cancelParticipation(parseInt(id));

            if (result) {
              setIsParticipating(false);
              refetch(); // 세션 정보 새로고침
              Toast.show({
                type: 'success',
                text1: '참여 취소 완료',
                text2: '여행 참여 신청이 취소되었습니다.',
              });
            }
          } catch (error) {
            console.error('참여 취소 에러:', error);
            Toast.show({
              type: 'error',
              text1: '참여 취소 실패',
              text2: '잠시 후 다시 시도해주세요.',
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  }, [id, refetch]);

  // 가이드용 모집 마감 처리
  const handleCloseRecruitment = useCallback(async () => {
    if (!id) return;

    Alert.alert('모집 마감', '모집을 마감하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          try {
            const success = await closeSession(parseInt(id));
            if (success) {
              Toast.show({
                type: 'success',
                text1: '모집이 마감되었습니다.',
              });
              refetch();
            } else {
              Toast.show({
                type: 'error',
                text1: '모집 마감에 실패했습니다.',
              });
            }
          } catch (error) {
            console.error('세션 모집 마감 에러:', error);
            Toast.show({
              type: 'error',
              text1: '모집 마감 중 오류가 발생했습니다.',
              text2: '잠시 후 다시 시도해주세요.',
            });
          }
        },
      },
    ]);
  }, [id, refetch]);

  // 가이드용 세션 삭제 처리
  const handleDeleteSession = useCallback(async () => {
    if (!id) return;

    Alert.alert('세션 삭제', '정말로 이 세션을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const success = await deleteSession(parseInt(id));
            if (success) {
              Toast.show({
                type: 'success',
                text1: '세션이 삭제되었습니다.',
              });
              router.push('/guide/session');
            } else {
              Toast.show({
                type: 'error',
                text1: '세션 삭제에 실패했습니다.',
              });
            }
          } catch (error) {
            console.error('세션 삭제 에러:', error);
            Toast.show({
              type: 'error',
              text1: '세션 삭제 중 오류가 발생했습니다.',
              text2: '잠시 후 다시 시도해주세요.',
            });
          }
        },
      },
    ]);
  }, [id, router]);

  // 여행자용 리뷰 작성 처리
  const handleWriteReview = useCallback(() => {
    if (!id) return;
    router.push({
      pathname: '/ReviewWriteScreen',
      params: { sessionId: id },
    });
  }, [id, router]);

  // 섹션으로 스크롤
  const scrollToSection = useCallback(
    (sectionName: keyof typeof sectionRefs) => {
      const sectionRef = sectionRefs[sectionName].current;
      const scrollView = mainScrollViewRef.current;

      if (!sectionRef || !scrollView) return;

      sectionRef.measureLayout(
        scrollView as any,
        (_x: number, y: number) => {
          scrollView.scrollTo({
            y: Math.max(0, y - 20), // 상단 여백 고려
            animated: true,
          });
        },
        () => {
          // measureLayout 실패 시 기본 스크롤 시도
          console.warn(`Failed to measure layout for section: ${sectionName}`);
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // sectionRefs는 ref 객체이므로 안정적이어서 의존성 배열에 포함할 필요 없음
  );

  // 맨 위로 스크롤
  const scrollToTop = useCallback(() => {
    if (mainScrollViewRef.current) {
      mainScrollViewRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, []);

  // 이미지 관련 함수들
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  const handleMomentumScrollEnd = (event: any) => {
    if (imageUrls.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleImageViewerMomentumScrollEnd = (event: any) => {
    if (imageUrls.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setSelectedImageIndex(index);
  };

  const goToNextImage = () => {
    if (imageUrls.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % imageUrls.length;
    scrollViewRef?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
    setCurrentImageIndex(nextIndex);
  };

  const goToPreviousImage = () => {
    if (imageUrls.length <= 1) return;
    const prevIndex =
      currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
    scrollViewRef?.scrollTo({ x: prevIndex * SCREEN_WIDTH, animated: true });
    setCurrentImageIndex(prevIndex);
  };

  // 이미지 관련 useEffect
  useEffect(() => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [imageUrls]);

  // 로딩 중일 때
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={mainScrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          userType === 'guide' ? (
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          ) : undefined
        }
      >
        {/* 커버 이미지 */}
        <View style={styles.coverContainer}>
          {imageUrls.length > 0 ? (
            <>
              <ScrollView
                ref={setScrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                style={styles.imageScrollView}
                decelerationRate='fast'
                bounces={false}
              >
                {imageUrls.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.coverImage}
                  />
                ))}
              </ScrollView>

              {/* 좌우 네비게이션 버튼 */}
              {imageUrls.length > 1 && (
                <>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={goToPreviousImage}
                  >
                    <Ionicons name='chevron-back' size={24} color='#fff' />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.navButton, styles.navButtonRight]}
                    onPress={goToNextImage}
                  >
                    <Ionicons name='chevron-forward' size={24} color='#fff' />
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name='image-outline' size={48} color='#9CA3AF' />
              <Text style={styles.placeholderText}>대표 이미지 없음</Text>
            </View>
          )}

          {/* 페이지 인디케이터 */}
          {imageUrls.length > 1 && (
            <View style={styles.paginationContainer}>
              {imageUrls.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* 상단 바 */}
        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>

          {/* 가이드용 우측 아이콘들 */}
          {userType === 'guide' && (
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name='share-outline' size={20} color='#000' />
              </TouchableOpacity>
              {status === 'RECRUITING' && (
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => {
                    router.push({
                      pathname: '/guide/session/[id]/edit-recruitment',
                      params: { id },
                    });
                  }}
                >
                  <Ionicons name='create-outline' size={20} color='#000' />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* 기본 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>

          {/* 가이드 정보 */}
          <View style={styles.guideContainer}>
            {guide ? (
              <Image
                source={{ uri: guide.profileImageUrl }}
                style={styles.guideAvatar}
                contentFit='cover'
              />
            ) : (
              <View style={styles.guideAvatarPlaceholder}>
                <Ionicons name='person-outline' size={20} color='#9CA3AF' />
              </View>
            )}
            <View style={styles.guideInfo}>
              <Text style={styles.guideLabel}>가이드</Text>
              <Text style={styles.guideName}>
                {guide ? guide.nickname : '알 수 없음'}
              </Text>
            </View>
          </View>

          {/* 상태 배지 */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                status === 'RECRUITING' && styles.statusRecruiting,
                status === 'RECRUITMENT_CLOSED' && styles.statusClosed,
                status === 'IN_PROGRESS' && styles.statusInProgress,
                status === 'COMPLETED' && styles.statusCompleted,
                userType === 'traveler' && styles.statusRecruiting,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === 'RECRUITING' && { color: '#7C3AED' },
                  status === 'RECRUITMENT_CLOSED' && { color: '#C2410C' },
                  status === 'IN_PROGRESS' && { color: '#FFFFFF' },
                  status === 'COMPLETED' && { color: '#15803D' },
                  userType === 'traveler' && { color: '#7C3AED' },
                ]}
              >
                {userType === 'traveler'
                  ? '모집 중'
                  : (status === 'RECRUITING' && '모집중') ||
                    (status === 'RECRUITMENT_CLOSED' && '모집마감') ||
                    (status === 'IN_PROGRESS' && '진행중') ||
                    (status === 'COMPLETED' && '완료')}
              </Text>
            </View>
          </View>

          {/* 정보 아이템들 */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name='calendar-outline' size={20} color='#6B7280' />
              <Text style={styles.infoText}>
                {formatDate(startDate)} - {formatDate(endDate)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name='people-outline' size={20} color='#6B7280' />
              <Text style={styles.infoText}>
                {currentParticipants}/{maxParticipants}명
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name='location-outline' size={20} color='#6B7280' />
            <Text style={styles.infoText}>{regionNames.join(', ')}</Text>
          </View>

          {/* 태그 */}
          {tagNames.length > 0 && (
            <View style={styles.tagsContainer}>
              {tagNames.map((tag: string, index: number) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 섹션 네비게이션 */}
        <View style={styles.sectionNavigation}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionNavContent}
          >
            <TouchableOpacity
              style={styles.sectionNavButton}
              onPress={() => scrollToSection('info')}
            >
              <Text style={styles.sectionNavText}>여행 정보</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionNavButton}
              onPress={() => scrollToSection('itinerary')}
              disabled={availableDays.length === 0}
            >
              <Text
                style={[
                  styles.sectionNavText,
                  availableDays.length === 0 && styles.sectionNavTextDisabled,
                ]}
              >
                일정
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionNavButton}
              onPress={() => scrollToSection('review')}
            >
              <Text style={styles.sectionNavText}>리뷰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionNavButton}
              onPress={() => scrollToSection('participants')}
            >
              <Text style={styles.sectionNavText}>참여자 목록</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 여행 소개 섹션 */}
        <View ref={sectionRefs.info} style={styles.section}>
          <Text style={styles.sectionTitle}>여행 소개</Text>
          <Text style={styles.description}>{content}</Text>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 사진 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사진</Text>

          {imageUrls.length > 0 ? (
            <View style={styles.photoGrid}>
              {imageUrls.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoGridItem}
                  onPress={() => openImageViewer(index)}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.photoGridImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPhotoContainer}>
              <Ionicons name='images-outline' size={48} color='#9CA3AF' />
              <Text style={styles.emptyPhotoText}>사진이 없습니다</Text>
            </View>
          )}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 일정 섹션 */}
        {availableDays.length > 0 && (
          <>
            <View ref={sectionRefs.itinerary} style={styles.section}>
              <Text style={styles.sectionTitle}>일정</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daySelection}
            >
              {availableDays.map((dayNumber) => (
                <TouchableOpacity
                  key={dayNumber}
                  style={[
                    styles.dayButton,
                    selectedDay === dayNumber && styles.dayButtonActive,
                  ]}
                  onPress={() => setSelectedDay(dayNumber)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDay === dayNumber && styles.dayButtonTextActive,
                    ]}
                  >
                    {dayNumber}일차
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[styles.section, { paddingTop: 0 }]}>
              {(itineraries[selectedDay] || [])
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((item) => (
                  <View key={item.id} style={styles.itineraryItem}>
                    <View style={styles.itineraryTime}>
                      <Text style={styles.itineraryTimeText}>
                        {item.startTime.substring(0, 5)}
                      </Text>
                    </View>
                    <View style={styles.itineraryContent}>
                      <Text style={styles.itineraryTitle}>{item.title}</Text>
                      {item.content ? (
                        <Text style={styles.itineraryDesc}>{item.content}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* 리뷰 섹션 */}
        <View ref={sectionRefs.review} style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>

          {isLoadingReviews ? (
            <View style={styles.reviewsLoadingContainer}>
              <Text style={styles.reviewsLoadingText}>
                리뷰를 불러오는 중...
              </Text>
            </View>
          ) : reviewData && reviewData.totalReviewCount > 0 ? (
            <>
              {/* 평균 평점 및 총 리뷰 수 */}
              <View style={styles.reviewSummary}>
                <View style={styles.ratingContainer}>
                  <Ionicons name='star' size={24} color='#FBBF24' />
                  <Text style={styles.averageRating}>
                    {reviewData.averageRating.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.totalReviewCount}>
                  총 {reviewData.totalReviewCount}개의 리뷰
                </Text>
              </View>

              {/* 리뷰 목록 */}
              <View style={styles.reviewsList}>
                {reviewData.review.map((review, index) => (
                  <View key={review.reviewId} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAuthor}>
                        {review.authorProfile ? (
                          <Image
                            source={{ uri: review.authorProfile }}
                            style={styles.reviewAuthorAvatar}
                            contentFit='cover'
                          />
                        ) : (
                          <View style={styles.reviewAuthorAvatarPlaceholder}>
                            <Ionicons
                              name='person-outline'
                              size={16}
                              color='#9CA3AF'
                            />
                          </View>
                        )}
                        <Text style={styles.reviewAuthorName}>
                          {review.authorNickname}
                        </Text>
                      </View>
                      <View style={styles.reviewRating}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? 'star' : 'star-outline'}
                            size={16}
                            color={i < review.rating ? '#FBBF24' : '#D1D5DB'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewContent}>{review.content}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    {index < reviewData.review.length - 1 && (
                      <View style={styles.reviewDivider} />
                    )}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyReviewsContainer}>
              <Ionicons name='chatbubbles-outline' size={48} color='#9CA3AF' />
              <Text style={styles.emptyReviewsText}>
                아직 작성된 리뷰가 없습니다.
              </Text>
            </View>
          )}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 참여자 목록 섹션 */}
        {(() => {
          // 가이드를 제외한 여행자만 필터링
          const travelers = participants.filter((p) => p.role === 'TRAVELER');

          return travelers.length > 0 ? (
            <>
              <View ref={sectionRefs.participants} style={styles.section}>
                <Text style={styles.sectionTitle}>참여자 목록</Text>
                <View style={styles.participantsContainer}>
                  {travelers.map((participant, index) => (
                    <View key={index} style={styles.participantItem}>
                      <Image
                        source={{ uri: participant.profileImageUrl }}
                        style={styles.participantAvatar}
                        contentFit='cover'
                      />
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>
                          {participant.nickname}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.divider} />
            </>
          ) : participants.length > 0 ? (
            <>
              <View ref={sectionRefs.participants} style={styles.section}>
                <Text style={styles.sectionTitle}>참여자 목록</Text>
                <View style={styles.emptyParticipantsContainer}>
                  <Ionicons name='people-outline' size={48} color='#D1D5DB' />
                  <Text style={styles.emptyParticipantsText}>
                    아직 신청인원이 없습니다.
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          ) : null;
        })()}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 맨 위로 스크롤 버튼 */}
      <TouchableOpacity
        style={[
          styles.scrollToTopButton,
          { bottom: insets.bottom + 100 }, // 하단 액션 버튼 위에 위치
        ]}
        onPress={scrollToTop}
        activeOpacity={0.8}
      >
        <Ionicons name='arrow-up' size={24} color='#FFFFFF' />
      </TouchableOpacity>

      {/* 하단 액션 버튼 */}
      <View
        style={[styles.bottomActionContainer, { paddingBottom: insets.bottom }]}
      >
        {userType === 'guide' ? (
          <>
            <TouchableOpacity
              style={[styles.ctaButton, styles.secondaryButton]}
              onPress={handleDeleteSession}
            >
              <Text style={styles.secondaryButtonText}>세션 삭제</Text>
            </TouchableOpacity>
            {status === 'RECRUITING' && (
              <TouchableOpacity
                style={[styles.ctaButton, styles.primaryButton]}
                onPress={handleCloseRecruitment}
              >
                <Text style={styles.primaryButtonText}>모집 마감</Text>
              </TouchableOpacity>
            )}
          </>
        ) : status === 'COMPLETED' && isParticipating ? (
          <TouchableOpacity
            style={[styles.ctaButton, styles.completedButton]}
            onPress={handleWriteReview}
          >
            <Text style={styles.completedButtonText}>리뷰 작성하기</Text>
          </TouchableOpacity>
        ) : isParticipating ? (
          <TouchableOpacity
            style={[
              styles.ctaButton,
              styles.cancelButton,
              isSubmitting && { backgroundColor: '#9CA3AF' },
            ]}
            onPress={handleCancelParticipation}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>
              {isSubmitting ? '취소 중...' : '참여 신청 취소'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.ctaButton,
              styles.primaryButton,
              isSubmitting && { backgroundColor: '#9CA3AF' },
            ]}
            onPress={handleParticipation}
            disabled={isSubmitting}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? '신청 중...' : '여행에 참여 신청하기'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 이미지 뷰어 모달 */}
      <Modal
        visible={isImageViewerVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.imageViewerCloseButton}
            onPress={closeImageViewer}
          >
            <Ionicons name='close' size={24} color='#fff' />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedImageIndex * SCREEN_WIDTH, y: 0 }}
            style={styles.imageViewerScrollView}
            onMomentumScrollEnd={handleImageViewerMomentumScrollEnd}
          >
            {imageUrls.map((imageUrl, index) => (
              <View key={index} style={styles.imageViewerItem}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imageViewerImage}
                  resizeMode='contain'
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.imageViewerIndicator}>
            <Text style={styles.imageViewerIndicatorText}>
              {selectedImageIndex + 1} / {imageUrls.length}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  userType,
}) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>세션 ID가 없습니다.</Text>
      </View>
    );
  }

  return (
    <SessionDetailsProvider id={id}>
      <SessionDetailContent userType={userType} />
    </SessionDetailsProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  coverContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#D9D9D9',
  },
  coverImage: {
    width: SCREEN_WIDTH,
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#9CA3AF',
  },
  imageScrollView: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
  },
  navButtonRight: {
    left: undefined,
    right: 16,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  guideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guideAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  guideAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  guideLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  guideName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusRecruiting: {
    backgroundColor: '#DDD6FE',
  },
  statusClosed: {
    backgroundColor: '#FED7AA',
  },
  statusInProgress: {
    backgroundColor: '#10B981',
  },
  statusCompleted: {
    backgroundColor: '#BBF7D0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tagChip: {
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  divider: {
    height: 8,
    backgroundColor: '#F4F4F4',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    marginTop: 10,
  },
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#8130FF',
  },
  secondaryButton: {
    backgroundColor: '#F3ECFF',
    borderWidth: 1,
    borderColor: '#D9C7FF',
  },
  completedButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#8130ff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  completedButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  participantsContainer: {
    marginTop: 16,
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  participantRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantRoleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  participantRoleGuide: {
    color: '#7C3AED',
    backgroundColor: '#DDD6FE',
  },
  participantRoleTraveler: {
    color: '#15803D',
    backgroundColor: '#D1FAE5',
  },
  emptyParticipantsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyParticipantsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  daySelection: {
    flexDirection: 'row',
    paddingBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dayButtonActive: {
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#8130FF',
  },
  dayButtonTextActive: {
    fontSize: 16,
    color: '#fff',
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itineraryTime: {
    width: 70,
  },
  itineraryTimeText: {
    fontSize: 14,
    color: '#8130FF',
    fontWeight: 'bold',
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itineraryDesc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  photoGridItem: {
    width: '30%',
    aspectRatio: 1,
    marginRight: '3.33%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyPhotoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewerScrollView: {
    flex: 1,
    width: '100%',
  },
  imageViewerItem: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerImage: {
    width: '100%',
    height: '100%',
  },
  imageViewerIndicator: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageViewerIndicatorText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reviewsLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  reviewsLoadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  averageRating: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  totalReviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewsList: {
    marginTop: 20,
  },
  reviewItem: {
    paddingVertical: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reviewAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  reviewAuthorAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyReviewsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  sectionNavigation: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionNavContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  sectionNavButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  sectionNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  sectionNavTextDisabled: {
    color: '#9CA3AF',
  },
  scrollToTopButton: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8130FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SessionDetailScreen;
