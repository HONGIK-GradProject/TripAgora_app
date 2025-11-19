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
import { addWishlist, deleteWishlist } from '@/services/wishlist';
import { ReviewData, ReviewGetByTemplateData } from '@/types/reviews';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
  useSegments,
} from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
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
  const bottomActionPadding = Math.min(Math.max(insets.bottom, 16), 24);
  const segments = useSegments();
  const { id, fromProfile } = useLocalSearchParams<{
    id: string;
    fromProfile?: string;
  }>();

  // 프로필에서 진입했는지 추적 (쿼리 파라미터로 전달)
  const cameFromProfile = fromProfile === 'true';

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
    isInWishlist: contextIsInWishlist = false,
    setIsInWishlist,
    itineraries = {},
    guideProfileId,
    isMySession = false,
    isLoading = true,
    refetch = () => {},
  } = sessionDetails || {};

  // 공통 네비게이션 핸들러 (뒤로 가기, 세션 삭제 후 등에서 사용)
  const handleNavigateBack = useCallback(() => {
    if (userType === 'guide') {
      // 프로필에서 진입한 경우 프로필로 돌아가기
      if (cameFromProfile) {
        router.push('/guide/profile');
        return true; // 네비게이션 처리됨
      } else {
        // 세션 스택 내에 있으면 세션 목록으로 이동
        const isInSessionStack =
          segments[1] === 'guide' && segments[2] === 'session';
        if (isInSessionStack) {
          router.replace('/guide/session');
          return true; // 네비게이션 처리됨
        }
      }
    }
    // 기본 동작 (router.back())
    return false;
  }, [userType, cameFromProfile, router, segments]);

  // 하드웨어 뒤로 가기 버튼 핸들러
  const handleBackPress = useCallback(() => {
    const handled = handleNavigateBack();
    return handled; // true면 이벤트 소비, false면 기본 동작
  }, [handleNavigateBack]);

  // 가이드만 화면 포커스 시 데이터 새로고침 및 하드웨어 뒤로 가기 버튼 처리
  useFocusEffect(
    useCallback(() => {
      if (userType === 'guide') {
        refetch();
      }

      // Android 하드웨어 뒤로 가기 버튼 처리
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [refetch, userType, handleBackPress])
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
  // 이미지 로드 실패 추적
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(
    new Set()
  );
  // 위시리스트 상태 관리 (여행자용)
  const [isInWishlist, setIsInWishlistLocal] = useState(contextIsInWishlist);
  const [isWishlistSubmitting, setIsWishlistSubmitting] = useState(false);

  // 컨텍스트의 isParticipating 상태가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setIsParticipating(contextIsParticipating);
  }, [contextIsParticipating]);

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
              review.authorProfileImage ??
              review.authorProfileImageUrl ??
              review.authorProfileUrl ??
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
  // 컨텍스트의 isInWishlist 상태가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setIsInWishlistLocal(contextIsInWishlist);
  }, [contextIsInWishlist]);

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
    if (!regionIds || regionIds.length === 0) {
      return [];
    }
    return regionIds.map(
      (id: number) => REGION_ID_TO_NAME_MAP[id] || '알 수 없는 지역'
    );
  }, [regionIds]);

  const regionText = useMemo(() => {
    return regionNames.length > 0 ? regionNames.join(', ') : '지역 정보 없음';
  }, [regionNames]);

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
      Object.entries(itineraries)
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([day]) => Number(day))
        .sort((a, b) => a - b),
    [itineraries]
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(
    availableDays.length > 0 ? availableDays[0] : null
  );

  useEffect(() => {
    if (availableDays.length === 0) {
      setSelectedDay(null);
      return;
    }

    setSelectedDay((prev) => {
      if (prev !== null && availableDays.includes(prev)) {
        return prev;
      }
      return availableDays[0];
    });
  }, [availableDays]);

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

              // 위시리스트에 있으면 자동으로 제거
              if (isInWishlist) {
                try {
                  const deleteSuccess = await deleteWishlist(parseInt(id));
                  if (deleteSuccess) {
                    setIsInWishlistLocal(false);
                    setIsInWishlist?.(false);
                  }
                } catch (wishlistError) {
                  console.error('위시리스트 제거 에러:', wishlistError);
                  // 위시리스트 제거 실패해도 참여 신청은 성공했으므로 계속 진행
                }
              }

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
              text2: '다른 날짜에 참여 중인 여행이 있는지 확인해 주세요.',
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  }, [id, refetch, isInWishlist, setIsInWishlist]);

  // 여행자용 위시리스트 토글 처리
  const handleToggleWishlist = useCallback(async () => {
    if (!id || isWishlistSubmitting) return;

    try {
      setIsWishlistSubmitting(true);

      if (isInWishlist) {
        // 위시리스트에서 제거
        const success = await deleteWishlist(parseInt(id));
        if (success) {
          setIsInWishlistLocal(false);
          setIsInWishlist?.(false);
        } else {
          throw new Error('위시리스트 제거 실패');
        }
      } else {
        // 위시리스트에 추가
        const success = await addWishlist(parseInt(id));
        if (success) {
          setIsInWishlistLocal(true);
          setIsInWishlist?.(true);
        } else {
          throw new Error('위시리스트 추가 실패');
        }
      }
    } catch (error) {
      console.error('위시리스트 업데이트 에러:', error);
      Toast.show({
        type: 'error',
        text1: '위시리스트 업데이트 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsWishlistSubmitting(false);
    }
  }, [id, isInWishlist, isWishlistSubmitting, setIsInWishlist]);

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

    Alert.alert('여행 삭제', '정말로 이 여행을 삭제하시겠습니까?', [
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
                text1: '여행이 삭제되었습니다.',
              });
              // 공통 네비게이션 핸들러 사용
              const handled = handleNavigateBack();
              if (!handled) {
                router.back();
              }
            } else {
              Toast.show({
                type: 'error',
                text1: '여행 삭제에 실패했습니다.',
              });
            }
          } catch (error) {
            console.error('여행 삭제 에러:', error);
            Toast.show({
              type: 'error',
              text1: '여행 삭제 중 오류가 발생했습니다.',
              text2: '잠시 후 다시 시도해주세요.',
            });
          }
        },
      },
    ]);
  }, [id, router, handleNavigateBack]);

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
            onPress={() => {
              const handled = handleNavigateBack();
              if (!handled) {
                // 기본 동작 (여행자 또는 일반 뒤로 가기)
                router.back();
              }
            }}
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
          <Text style={styles.title}>{title?.trim() || '제목 없음'}</Text>

          {/* 가이드 정보 */}
          {(() => {
            const guide = participants.find((p) => p.role === 'GUIDE');
            // 여행자가 자신의 세션을 볼 때는 프로필 링크 제거
            const isMySessionAsTraveler =
              userType === 'traveler' && isMySession;
            const Container = isMySessionAsTraveler ? View : TouchableOpacity;

            return (
              <Container
                style={styles.guideContainer}
                {...(!isMySessionAsTraveler && {
                  onPress: () => {
                    if (guide && id && guideProfileId) {
                      // 현재 세션 스택 내에서 가이드 프로필 화면으로 이동
                      // userType과 현재 경로에 따라 올바른 스택 내 경로로 이동
                      // guideProfileId를 사용하여 프로필 조회
                      const profilePath =
                        userType === 'guide'
                          ? `/guide/session/${id}/${guideProfileId}`
                          : segments.join('/').includes('/trip/')
                          ? `/traveler/trip/${id}/${guideProfileId}`
                          : `/traveler/explore/${id}/${guideProfileId}`;
                      // Expo Router 타입 정의 제한으로 인한 타입 캐스팅
                      router.push(profilePath as any);
                    }
                  },
                  activeOpacity: 0.7,
                  disabled: !guide || !guideProfileId,
                })}
              >
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
                    {guide
                      ? isMySessionAsTraveler
                        ? `${guide.nickname} (나)`
                        : guide.nickname
                      : '알 수 없음'}
                  </Text>
                </View>
                {guide && !isMySessionAsTraveler && (
                  <Ionicons
                    name='chevron-forward'
                    size={20}
                    color='#9CA3AF'
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </Container>
            );
          })()}

          {/* 상태 배지 */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                status === 'RECRUITING' && styles.statusRecruiting,
                status === 'RECRUITMENT_CLOSED' && styles.statusClosed,
                status === 'IN_PROGRESS' && styles.statusInProgress,
                status === 'COMPLETED' && styles.statusCompleted,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === 'RECRUITING' && { color: '#5B67F5' },
                  status === 'RECRUITMENT_CLOSED' && { color: '#C2410C' },
                  status === 'IN_PROGRESS' && { color: '#FFFFFF' },
                  status === 'COMPLETED' && { color: '#15803D' },
                ]}
              >
                {(status === 'RECRUITING' && '모집 중') ||
                  (status === 'RECRUITMENT_CLOSED' && '모집 마감') ||
                  (status === 'IN_PROGRESS' && '진행 중') ||
                  (status === 'COMPLETED' && '완료') ||
                  '알 수 없음'}
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
            <Text style={styles.infoText}>{regionText}</Text>
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
          <Text style={styles.description}>
            {content?.trim() || '내용 없음'}
          </Text>
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
        <View ref={sectionRefs.itinerary} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>일정</Text>
            {availableDays.length > 0 && userType === 'traveler' && (
              <TouchableOpacity
                onPress={() => {
                  const itineraryDetailsPath = segments
                    .join('/')
                    .includes('/trip/')
                    ? `/traveler/trip/${id}/itinerary-details`
                    : `/traveler/explore/${id}/itinerary-details`;
                  router.push(itineraryDetailsPath as any);
                }}
                style={styles.viewMoreButton}
              >
                <Text style={styles.viewMoreButtonText}>상세보기</Text>
                <Ionicons name='chevron-forward' size={16} color='#5B67F5' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {availableDays.length === 0 ? (
          <View style={styles.emptyItineraryContainer}>
            <Ionicons name='calendar-clear-outline' size={40} color='#9CA3AF' />
            <Text style={styles.emptyItineraryTitle}>등록된 일정이 없어요</Text>
            <Text style={styles.emptyItinerarySubtitle}>
              {userType === 'guide'
                ? '편집 화면에서 일정을 추가해 보세요.'
                : '가이드가 일정을 추가하면 이곳에서 확인할 수 있어요.'}
            </Text>
          </View>
        ) : (
          <>
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
              {(selectedDay !== null ? itineraries[selectedDay] || [] : [])
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((item) => (
                  <View key={item.id} style={styles.itineraryItem}>
                    <View style={styles.itineraryTime}>
                      <Text style={styles.itineraryTimeText}>
                        {item.startTime.substring(0, 5)}
                      </Text>
                    </View>
                    <View style={styles.itineraryContent}>
                      <Text style={styles.itineraryTitle}>{item.location}</Text>
                      {item.content ? (
                        <Text style={styles.itineraryDesc}>{item.content}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
            </View>
          </>
        )}

        <View style={styles.divider} />
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
                {reviewData.review.map((review, index) => {
                  const hasValidProfile =
                    review.authorProfile &&
                    review.authorProfile.trim() !== '' &&
                    !imageLoadErrors.has(review.reviewId);

                  return (
                    <View key={review.reviewId} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <View style={styles.reviewAuthor}>
                          {hasValidProfile ? (
                            <Image
                              source={{ uri: review.authorProfile }}
                              style={styles.reviewAuthorAvatar}
                              contentFit='cover'
                              onError={() => {
                                setImageLoadErrors((prev) =>
                                  new Set(prev).add(review.reviewId)
                                );
                              }}
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
                        {new Date(review.createdAt + 'Z').toLocaleDateString(
                          'ko-KR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </Text>
                      {index < reviewData.review.length - 1 && (
                        <View style={styles.reviewDivider} />
                      )}
                    </View>
                  );
                })}
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
            </>
          ) : participants.length > 0 ? (
            <>
              <View ref={sectionRefs.participants} style={styles.section}>
                <Text style={styles.sectionTitle}>참여자 목록</Text>
                <View style={styles.emptyParticipantsContainer}>
                  <Ionicons name='people-outline' size={48} color='#9CA3AF' />
                  <Text style={styles.emptyParticipantsText}>
                    아직 신청인원이 없습니다.
                  </Text>
                </View>
              </View>
            </>
          ) : null;
        })()}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 맨 위로 스크롤 버튼 */}
      <TouchableOpacity
        style={[
          styles.scrollToTopButton,
          { bottom: insets.bottom + 12 }, // 하단 액션 버튼 위에 위치
        ]}
        onPress={scrollToTop}
        activeOpacity={0.8}
      >
        <Ionicons name='arrow-up' size={24} color='#FFFFFF' />
      </TouchableOpacity>

      {/* 하단 액션 버튼 */}
      <View
        style={[
          styles.bottomActionContainer,
          { paddingBottom: bottomActionPadding, bottom: -insets.bottom },
        ]}
      >
        {status === 'COMPLETED' ? (
          // 완료된 세션
          userType === 'guide' ? (
            // 가이드: 완료된 여행입니다 (비활성화)
            <TouchableOpacity
              style={[styles.ctaButton, styles.disabledButton]}
              disabled={true}
            >
              <Text style={styles.disabledButtonText}>완료된 여행입니다</Text>
            </TouchableOpacity>
          ) : (
            // 여행자: 세션 룸과 리뷰 작성 버튼
            <>
              <TouchableOpacity
                style={[styles.ctaButton, styles.secondaryButton]}
                onPress={() => {
                  const sessionRoomPath = segments.join('/').includes('/trip/')
                    ? `/traveler/trip/${id}/session-room`
                    : `/traveler/explore/${id}/session-room`;
                  router.push(sessionRoomPath as any);
                }}
              >
                <Text style={styles.secondaryButtonText}>여행 룸</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ctaButton, styles.primaryButton]}
                onPress={() => {
                  router.push({
                    pathname: '/ReviewWriteScreen',
                    params: { sessionId: id },
                  } as any);
                }}
              >
                <Text style={styles.primaryButtonText}>리뷰 작성</Text>
              </TouchableOpacity>
            </>
          )
        ) : status === 'IN_PROGRESS' ? (
          // 진행 중인 세션: 여행 삭제/참여 취소 불가
          <TouchableOpacity
            style={[styles.ctaButton, styles.disabledButton]}
            disabled={true}
          >
            <Text style={styles.disabledButtonText}>여행이 진행중입니다</Text>
          </TouchableOpacity>
        ) : userType === 'guide' ? (
          // 가이드: 일반 상태
          <>
            <TouchableOpacity
              style={[styles.ctaButton, styles.secondaryButton]}
              onPress={handleDeleteSession}
            >
              <Text style={styles.secondaryButtonText}>여행 삭제</Text>
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
        ) : isMySession ? (
          // 여행자: 자신이 개설한 세션
          <TouchableOpacity
            style={[styles.ctaButton, styles.disabledButton]}
            disabled={true}
          >
            <Text style={styles.disabledButtonText}>
              내가 개설한 여행입니다
            </Text>
          </TouchableOpacity>
        ) : isParticipating ? (
          // 여행자: 참여 중인 세션 (위시리스트 버튼 없음)
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
          // 여행자: 참여 신청 가능한 세션
          <>
            {/* 여행자용 하트 버튼 */}
            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={handleToggleWishlist}
              disabled={isWishlistSubmitting}
            >
              <Ionicons
                name={isInWishlist ? 'heart' : 'heart-outline'}
                size={24}
                color={isInWishlist ? '#5B67F5' : '#000'}
              />
            </TouchableOpacity>
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
          </>
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
                  contentFit='contain'
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
  itineraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#E6E9FF',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E6E9FF',
    borderRadius: 16,
  },
  viewMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B67F5',
    marginRight: 4,
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
    backgroundColor: '#5B67F5',
  },
  secondaryButton: {
    backgroundColor: '#E6E9FF',
    borderWidth: 1,
    borderColor: '#C5CCFF',
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
  disabledButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  wishlistButton: {
    width: 78,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#5B67F5',
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
  disabledButtonText: {
    color: '#9CA3AF',
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
    color: '#5B67F5',
    backgroundColor: '#E6E9FF',
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
    backgroundColor: '#5B67F5',
    borderColor: '#5B67F5',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#5B67F5',
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
    color: '#5B67F5',
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
  emptyItineraryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyItineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyItinerarySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
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
    backgroundColor: '#5B67F5',
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
