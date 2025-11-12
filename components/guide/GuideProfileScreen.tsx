import CustomImagePicker from '@/components/ui/ImagePicker';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
import { useAuth } from '@/hooks/useAuth';
import {
  getGuideProfile,
  getMyGuideProfile,
  updateGuideProfileBio,
  updateGuideProfileImage,
  updateGuideProfilePortfolios,
} from '@/services/guideProfiles';
import { GuideProfileGetData, Portfolio } from '@/types/guideProfiles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useSegments } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface GuideProfileScreenProps {
  guideProfileId?: number;
  showBackButton?: boolean;
}

const GuideProfileScreen: React.FC<GuideProfileScreenProps> = ({
  guideProfileId,
  showBackButton = false,
}) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const params = useLocalSearchParams<{ profileImageUrl?: string }>();

  // 세션 상세에서 전달된 가이드 프로필 사진 URL
  const guideProfileImageUrl = params.profileImageUrl;

  // 현재 자신의 프로필인지 확인 (guideProfileId가 없으면 자신의 프로필)
  const isOwnProfile = !guideProfileId;

  // 가이드 프로필 데이터 상태
  const [guideProfile, setGuideProfile] = useState<
    GuideProfileGetData | undefined
  >(undefined);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // 편집 상태
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editingBio, setEditingBio] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const [isEditingPortfolios, setIsEditingPortfolios] = useState(false);
  const [editingPortfolios, setEditingPortfolios] = useState<Portfolio[]>([]);
  const [isSavingPortfolios, setIsSavingPortfolios] = useState(false);

  // 가이드 프로필 조회 함수
  const fetchGuideProfile = useCallback(
    async (profileId?: number) => {
      const targetId = profileId || guideProfileId;

      // guideProfileId가 없고 자신의 프로필도 아닌 경우 조회하지 않음
      if (!targetId && !isOwnProfile) {
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        let data: GuideProfileGetData | undefined;

        if (isOwnProfile) {
          // 자신의 프로필인 경우 전용 API 사용
          data = await getMyGuideProfile(0);
        } else if (targetId) {
          // 다른 가이드 프로필 조회
          data = await getGuideProfile(targetId, 0);
        } else {
          setIsLoadingProfile(false);
          return;
        }

        if (data) {
          setGuideProfile(data);
        } else {
          setProfileError('가이드 프로필을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('가이드 프로필 조회 실패:', error);
        setProfileError('가이드 프로필을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    },
    [guideProfileId, isOwnProfile]
  );

  // 가이드 프로필 조회
  useEffect(() => {
    fetchGuideProfile();
  }, [fetchGuideProfile]);

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    await fetchGuideProfile();
  }, [fetchGuideProfile]);

  // 가이드 정보 (API 데이터 또는 기본값)
  const guideInfo = useMemo(() => {
    if (guideProfile) {
      return {
        nickname: guideProfile.nickname,
        profileImageUrl: guideProfile.imageUrl,
        bio: guideProfile.bio,
        tags: guideProfile.tags,
        portfolios: guideProfile.portfolios,
      };
    }
    // 로딩 중이거나 에러인 경우 기본값 반환
    if (isOwnProfile && user) {
      return {
        nickname: user.nickname || '닉네임 없음',
        profileImageUrl: user.profileImageUrl || '',
        bio: '',
        tags: [],
        portfolios: [],
      };
    }
    // 프로필 데이터가 없는 경우 기본값
    return {
      nickname: '가이드',
      profileImageUrl: '',
      bio: '',
      tags: [],
      portfolios: [],
    };
  }, [guideProfile, isOwnProfile, user]);

  // 모집 중인 세션 목록 (API에서 가져온 데이터 사용)
  const recruitingSessions = useMemo(() => {
    return guideProfile?.SessionList?.sessions || [];
  }, [guideProfile]);

  // bio 편집 시작
  const handleStartEditBio = () => {
    setEditingBio(guideInfo.bio);
    setIsEditingBio(true);
  };

  // bio 편집 취소
  const handleCancelEditBio = () => {
    setIsEditingBio(false);
    setEditingBio('');
  };

  // bio 저장
  const handleSaveBio = async () => {
    if (editingBio === guideInfo.bio) {
      setIsEditingBio(false);
      return;
    }

    setIsSavingBio(true);
    try {
      const result = await updateGuideProfileBio(editingBio);
      if (result) {
        setGuideProfile((prev) => {
          if (prev) {
            return { ...prev, bio: result.bio };
          }
          // 자신의 프로필인 경우 초기 데이터 생성
          return {
            nickname: user?.nickname || '닉네임 없음',
            imageUrl: user?.profileImageUrl || '',
            bio: result.bio,
            tags: [],
            portfolios: [],
            SessionList: { sessions: [], hasNext: false },
          };
        });
        setIsEditingBio(false);
        Toast.show({
          type: 'success',
          text1: '소개글이 수정되었습니다.',
        });
      }
    } catch (error) {
      console.error('소개글 수정 실패:', error);
      Toast.show({
        type: 'error',
        text1: '소개글 수정에 실패했습니다.',
      });
    } finally {
      setIsSavingBio(false);
    }
  };

  // 이미지 선택 핸들러
  const handleImageSelected = async (uri: string | null) => {
    if (!uri) return;

    setIsSavingImage(true);
    try {
      const result = await updateGuideProfileImage(uri);
      if (result) {
        setGuideProfile((prev) => {
          if (prev) {
            return { ...prev, imageUrl: result.imageUrl };
          }
          // 자신의 프로필인 경우 초기 데이터 생성
          return {
            nickname: user?.nickname || '닉네임 없음',
            imageUrl: result.imageUrl,
            bio: '',
            tags: [],
            portfolios: [],
            SessionList: { sessions: [], hasNext: false },
          };
        });
        setIsEditingImage(false);
        Toast.show({
          type: 'success',
          text1: '이미지가 변경되었습니다.',
        });
      }
    } catch (error) {
      console.error('이미지 변경 실패:', error);
      Toast.show({
        type: 'error',
        text1: '이미지 변경에 실패했습니다.',
      });
    } finally {
      setIsSavingImage(false);
    }
  };

  // 포트폴리오 편집 시작
  const handleStartEditPortfolios = () => {
    setEditingPortfolios([...guideInfo.portfolios]);
    setIsEditingPortfolios(true);
  };

  // 포트폴리오 편집 취소
  const handleCancelEditPortfolios = () => {
    setIsEditingPortfolios(false);
    setEditingPortfolios([]);
  };

  // 포트폴리오 추가 상태
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolioType, setNewPortfolioType] = useState<
    Portfolio['type'] | ''
  >('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // 포트폴리오 추가
  const handleAddPortfolio = () => {
    setIsAddingPortfolio(true);
    setNewPortfolioType('');
    setNewPortfolioUrl('');
  };

  // 포트폴리오 추가 완료
  const handleConfirmAddPortfolio = () => {
    if (newPortfolioType && newPortfolioUrl) {
      setEditingPortfolios([
        ...editingPortfolios,
        { type: newPortfolioType, url: newPortfolioUrl },
      ]);
      setIsAddingPortfolio(false);
      setNewPortfolioType('');
      setNewPortfolioUrl('');
    }
  };

  // 포트폴리오 삭제
  const handleRemovePortfolio = (index: number) => {
    setEditingPortfolios(editingPortfolios.filter((_, i) => i !== index));
  };

  // 포트폴리오 저장
  const handleSavePortfolios = async () => {
    setIsSavingPortfolios(true);
    try {
      const result = await updateGuideProfilePortfolios(editingPortfolios);
      if (result) {
        setGuideProfile((prev) => {
          if (prev) {
            return { ...prev, portfolios: result.portfolios };
          }
          // 자신의 프로필인 경우 초기 데이터 생성
          return {
            nickname: user?.nickname || '닉네임 없음',
            imageUrl: user?.profileImageUrl || '',
            bio: '',
            tags: [],
            portfolios: result.portfolios,
            SessionList: { sessions: [], hasNext: false },
          };
        });
        setIsEditingPortfolios(false);
        Toast.show({
          type: 'success',
          text1: '포트폴리오가 수정되었습니다.',
        });
      }
    } catch (error) {
      console.error('포트폴리오 수정 실패:', error);
      Toast.show({
        type: 'error',
        text1: '포트폴리오 수정에 실패했습니다.',
      });
    } finally {
      setIsSavingPortfolios(false);
    }
  };

  const handleSessionPress = (sessionId: number) => {
    // 현재 경로에 맞는 세션 상세 페이지로 이동
    // 프로필에서 진입한 경우 쿼리 파라미터를 추가하여 뒤로 가기 시 프로필로 돌아가도록 처리
    // segments 배열을 통해 정확한 스택 경로 파악
    const isGuideStack = segments[1] === 'guide' && segments[2] === 'session';
    const isTravelerTripStack =
      segments[1] === 'traveler' && segments[2] === 'trip';
    const isTravelerExploreStack =
      segments[1] === 'traveler' && segments[2] === 'explore';

    let sessionDetailPath: string;
    if (isGuideStack) {
      // 가이드 세션 스택
      sessionDetailPath = `/guide/session/${sessionId}`;
    } else if (isTravelerTripStack) {
      // 여행자 trip 스택
      sessionDetailPath = `/traveler/trip/${sessionId}`;
    } else if (isTravelerExploreStack) {
      // 여행자 explore 스택
      sessionDetailPath = `/traveler/explore/${sessionId}`;
    } else {
      // 기본값: 사용자 역할에 따라 결정
      if (user?.role === 'GUIDE') {
        sessionDetailPath = `/guide/session/${sessionId}`;
        // 프로필 탭에서 진입한 경우 쿼리 파라미터 추가
        if (segments[1] === 'guide' && segments[2] === 'profile') {
          sessionDetailPath += '?fromProfile=true';
        }
      } else {
        sessionDetailPath = `/traveler/explore/${sessionId}`;
      }
    }

    // Expo Router 타입 정의 제한으로 인한 타입 캐스팅
    router.push(sessionDetailPath as any);
  };

  const handlePortfolioPress = async (portfolio: Portfolio) => {
    try {
      const canOpen = await Linking.canOpenURL(portfolio.url);
      if (canOpen) {
        await Linking.openURL(portfolio.url);
      }
    } catch (error) {
      console.error('포트폴리오 링크 열기 실패:', error);
    }
  };

  const getPortfolioIcon = (type: Portfolio['type']) => {
    switch (type) {
      case 'FACEBOOK':
        return 'logo-facebook';
      case 'INSTAGRAM':
        return 'logo-instagram';
      case 'TWITTER':
        return 'logo-twitter';
      case 'YOUTUBE':
        return 'logo-youtube';
      case 'WEBSITE':
        return 'globe-outline';
      default:
        return 'link-outline';
    }
  };

  // 로딩 중일 때
  if (isLoadingProfile) {
    return (
      <View
        className='flex-1 bg-gray-50 justify-center items-center'
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size='large' color='#8130FF' />
        <Text className='text-gray-500 mt-4'>프로필을 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 발생 시
  if (profileError) {
    return (
      <View
        className='flex-1 bg-gray-50 justify-center items-center px-5'
        style={{ paddingTop: insets.top }}
      >
        <Ionicons name='alert-circle-outline' size={48} color='#EF4444' />
        <Text className='text-gray-900 text-lg font-semibold mt-4 text-center'>
          {profileError}
        </Text>
        {showBackButton && (
          <TouchableOpacity
            className='mt-4 bg-purple-600 rounded-xl px-6 py-3'
            onPress={() => router.back()}
          >
            <Text className='text-white font-semibold'>돌아가기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50' style={{ paddingTop: insets.top }}>
      {/* 헤더 */}
      {showBackButton && (
        <View className='bg-white px-5 py-4 flex-row items-center border-b border-gray-200'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='mr-3'
            activeOpacity={0.7}
          >
            <Ionicons name='arrow-back' size={24} color='#1F2937' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-900 flex-1'>
            가이드 프로필
          </Text>
        </View>
      )}

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          isOwnProfile ? (
            <RefreshControl
              refreshing={isLoadingProfile}
              onRefresh={handleRefresh}
              colors={['#8130FF']}
              tintColor='#8130FF'
            />
          ) : undefined
        }
      >
        {/* 배너 이미지 */}
        <View className='mx-5 mt-5 relative'>
          {guideInfo.profileImageUrl ? (
            <>
              <Image
                source={{ uri: guideInfo.profileImageUrl }}
                style={{ width: '100%', height: 200, borderRadius: 16 }}
                contentFit='cover'
              />
              {isOwnProfile && (
                <TouchableOpacity
                  onPress={() => setIsEditingImage(true)}
                  className='absolute top-3 right-3 bg-black/50 rounded-full p-2'
                  activeOpacity={0.7}
                >
                  <Ionicons name='camera-outline' size={20} color='#fff' />
                </TouchableOpacity>
              )}
            </>
          ) : (
            isOwnProfile && (
              <TouchableOpacity
                onPress={() => setIsEditingImage(true)}
                activeOpacity={0.7}
              >
                <View className='w-full h-52 bg-gray-100 rounded-2xl border border-dashed border-gray-300 items-center justify-center'>
                  <Ionicons name='image-outline' size={36} color='#9CA3AF' />
                  <Text className='text-gray-500 mt-2'>
                    배너 이미지를 추가하세요
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* 프로필 정보 */}
        <View className='bg-white mx-5 mt-5 rounded-2xl p-6 shadow-sm'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center flex-1'>
              <View className='w-16 h-16 rounded-full bg-gray-100 justify-center items-center shadow-sm mr-3'>
                {(() => {
                  // 세션 상세에서 전달된 프로필 사진 URL이 있으면 우선 사용
                  if (guideProfileImageUrl) {
                    return (
                      <Image
                        source={{ uri: guideProfileImageUrl }}
                        style={{ width: 64, height: 64, borderRadius: 32 }}
                        contentFit='cover'
                      />
                    );
                  }
                  // 자신의 프로필인 경우 user.profileImageUrl 사용
                  if (isOwnProfile && user?.profileImageUrl) {
                    return (
                      <Image
                        source={{ uri: user.profileImageUrl }}
                        style={{ width: 64, height: 64, borderRadius: 32 }}
                        contentFit='cover'
                      />
                    );
                  }
                  // 기본 아이콘
                  return (
                    <Ionicons
                      name='person-circle-outline'
                      size={48}
                      color='#9CA3AF'
                    />
                  );
                })()}
              </View>
              <Text className='text-2xl font-bold text-gray-900'>
                {guideInfo.nickname}
              </Text>
            </View>
          </View>

          {/* 가이드 소개 */}
          <View className='mb-4'>
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-lg font-semibold text-gray-900'>
                가이드 소개
              </Text>
              {isOwnProfile && !isEditingBio && (
                <TouchableOpacity
                  onPress={handleStartEditBio}
                  className='p-1'
                  activeOpacity={0.7}
                >
                  <Ionicons name='pencil-outline' size={18} color='#6B7280' />
                </TouchableOpacity>
              )}
            </View>
            {isEditingBio ? (
              <View>
                <TextInput
                  className='text-base text-gray-600 border border-gray-300 rounded-lg p-3 min-h-[100px]'
                  value={editingBio}
                  onChangeText={setEditingBio}
                  multiline
                  placeholder='소개글을 입력하세요'
                  placeholderTextColor='#9CA3AF'
                  style={{ textAlignVertical: 'top' }}
                />
                <View className='flex-row justify-end mt-2'>
                  <TouchableOpacity
                    onPress={handleCancelEditBio}
                    className='px-4 py-2 mr-2'
                    activeOpacity={0.7}
                  >
                    <Text className='text-gray-600'>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveBio}
                    className='bg-purple-600 px-4 py-2 rounded-lg'
                    activeOpacity={0.7}
                    disabled={isSavingBio}
                  >
                    {isSavingBio ? (
                      <ActivityIndicator size='small' color='#fff' />
                    ) : (
                      <Text className='text-white font-semibold'>저장</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text className='text-base text-gray-600'>
                {guideInfo.bio || (isOwnProfile ? '소개글을 작성해주세요' : '')}
              </Text>
            )}
          </View>

          {/* 관심사 태그 */}
          {guideInfo.tags && guideInfo.tags.length > 0 && (
            <View className='mb-4'>
              <Text className='text-lg font-semibold text-gray-900 mb-2'>
                관심사
              </Text>
              <View className='flex-row flex-wrap'>
                {guideInfo.tags.map((tagId) => (
                  <View
                    key={tagId}
                    className='bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mr-2 mb-2'
                  >
                    <Text className='text-purple-700 text-sm font-medium'>
                      {TAG_ID_TO_NAME_MAP[tagId] || `태그 ${tagId}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 포트폴리오 링크 */}
          <View className='border-t border-gray-100 pt-4'>
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-lg font-semibold text-gray-900'>
                포트폴리오
              </Text>
              {isOwnProfile && !isEditingPortfolios && (
                <TouchableOpacity
                  onPress={handleStartEditPortfolios}
                  className='p-1'
                  activeOpacity={0.7}
                >
                  <Ionicons name='pencil-outline' size={18} color='#6B7280' />
                </TouchableOpacity>
              )}
            </View>
            {guideInfo.portfolios && guideInfo.portfolios.length > 0 ? (
              <View className='flex-row flex-wrap'>
                {guideInfo.portfolios.map((portfolio, index) => (
                  <TouchableOpacity
                    key={index}
                    className='flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mr-2 mb-2'
                    onPress={() => handlePortfolioPress(portfolio)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={getPortfolioIcon(portfolio.type)}
                      size={18}
                      color='#6B7280'
                    />
                    <Text className='text-gray-700 text-sm font-medium ml-2'>
                      {portfolio.type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              isOwnProfile && (
                <Text className='text-gray-500 text-sm'>
                  포트폴리오를 추가해주세요
                </Text>
              )
            )}
          </View>
        </View>

        {/* 모집 중인 세션 목록 */}
        <View className='mx-5 mt-5 mb-5'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-2xl font-bold text-gray-900'>
              모집 중인 세션
            </Text>
          </View>

          {recruitingSessions.length > 0 ? (
            <View className='bg-white rounded-2xl shadow-sm overflow-hidden'>
              {recruitingSessions.map((session) => (
                <TouchableOpacity
                  key={session.sessionId}
                  className='flex-row items-center p-4 border-b border-gray-100 last:border-b-0'
                  onPress={() => handleSessionPress(session.sessionId)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: session.firstImageUrl }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      marginRight: 12,
                    }}
                    contentFit='cover'
                  />
                  <View className='flex-1'>
                    <Text
                      className='text-lg font-semibold text-gray-900 mb-1'
                      numberOfLines={1}
                    >
                      {session.title?.trim() || '제목 없음'}
                    </Text>
                    <Text className='text-sm text-gray-600 mb-2'>
                      {session.startDate} ~ {session.endDate}
                    </Text>
                    <Text className='text-sm text-gray-500' numberOfLines={1}>
                      {session.regionIds && session.regionIds.length > 0
                        ? session.regionIds
                            .map((id) => REGION_ID_TO_NAME_MAP[id])
                            .filter(Boolean)
                            .join(', ') || '지역 정보 없음'
                        : '지역 정보 없음'}
                    </Text>
                  </View>
                  <View className='bg-purple-100 px-3 py-1 rounded-full ml-2'>
                    <Text className='text-sm text-purple-700 font-medium'>
                      모집중
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className='bg-white rounded-2xl p-6 items-center justify-center shadow-sm'>
              <Ionicons name='calendar-outline' size={48} color='#9CA3AF' />
              <Text className='text-gray-500 mt-2 text-base'>
                모집 중인 세션이 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* 리뷰 목록 */}
        <View className='mx-5 mb-5'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-2xl font-bold text-gray-900'>리뷰</Text>
          </View>

          <View className='bg-white rounded-2xl p-6 items-center justify-center shadow-sm border border-gray-200'>
            <Ionicons name='star-outline' size={48} color='#9CA3AF' />
            <Text className='text-gray-500 mt-2 text-base'>
              아직 리뷰가 없습니다
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 이미지 편집 모달 */}
      <Modal
        visible={isEditingImage}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setIsEditingImage(false)}
      >
        <View className='flex-1 bg-black/50 justify-center items-center px-5'>
          <View className='bg-white rounded-2xl p-6 w-full max-w-sm'>
            <Text className='text-xl font-bold text-gray-900 mb-4 text-center'>
              프로필 이미지 변경
            </Text>
            <CustomImagePicker
              onImageSelected={handleImageSelected}
              aspect={[4, 3]}
            >
              <View className='bg-purple-600 rounded-xl px-6 py-3 items-center mb-3'>
                {isSavingImage ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text className='text-white font-semibold'>이미지 선택</Text>
                )}
              </View>
            </CustomImagePicker>
            <TouchableOpacity
              onPress={() => setIsEditingImage(false)}
              className='bg-gray-200 rounded-xl px-6 py-3 items-center'
              activeOpacity={0.7}
            >
              <Text className='text-gray-700 font-semibold'>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 포트폴리오 편집 모달 */}
      <Modal
        visible={isEditingPortfolios}
        transparent={true}
        animationType='slide'
        onRequestClose={handleCancelEditPortfolios}
      >
        <View
          className='flex-1 bg-black/50 justify-end'
          style={{ paddingTop: insets.top }}
        >
          <View
            className='bg-white rounded-t-3xl p-6'
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-2xl font-bold text-gray-900'>
                포트폴리오 편집
              </Text>
              <TouchableOpacity
                onPress={handleCancelEditPortfolios}
                activeOpacity={0.7}
              >
                <Ionicons name='close' size={24} color='#6B7280' />
              </TouchableOpacity>
            </View>

            <ScrollView className='max-h-96'>
              {editingPortfolios.map((portfolio, index) => (
                <View
                  key={index}
                  className='flex-row items-center justify-between bg-gray-50 rounded-lg p-3 mb-2'
                >
                  <View className='flex-row items-center flex-1'>
                    <Ionicons
                      name={getPortfolioIcon(portfolio.type)}
                      size={20}
                      color='#6B7280'
                    />
                    <View className='ml-3 flex-1'>
                      <Text className='text-gray-900 font-medium'>
                        {portfolio.type}
                      </Text>
                      <Text className='text-gray-500 text-sm' numberOfLines={1}>
                        {portfolio.url}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemovePortfolio(index)}
                    activeOpacity={0.7}
                    className='ml-2'
                  >
                    <Ionicons name='trash-outline' size={20} color='#EF4444' />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* 포트폴리오 추가 폼 */}
            {isAddingPortfolio && (
              <View className='bg-purple-50 rounded-lg p-4 mb-3 mt-4'>
                <Text className='text-gray-900 font-semibold mb-2'>
                  포트폴리오 추가
                </Text>
                <View className='mb-3'>
                  <Text className='text-gray-700 text-sm mb-1'>타입</Text>
                  <View className='flex-row flex-wrap'>
                    {(
                      [
                        'FACEBOOK',
                        'INSTAGRAM',
                        'TWITTER',
                        'YOUTUBE',
                        'WEBSITE',
                      ] as Portfolio['type'][]
                    ).map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setNewPortfolioType(type)}
                        className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                          newPortfolioType === type
                            ? 'bg-purple-600'
                            : 'bg-white border border-gray-300'
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`text-sm ${
                            newPortfolioType === type
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View className='mb-3'>
                  <Text className='text-gray-700 text-sm mb-1'>URL</Text>
                  <TextInput
                    className='bg-white border border-gray-300 rounded-lg p-3'
                    value={newPortfolioUrl}
                    onChangeText={setNewPortfolioUrl}
                    placeholder='https://...'
                    placeholderTextColor='#9CA3AF'
                    autoCapitalize='none'
                    keyboardType='url'
                  />
                </View>
                <View className='flex-row'>
                  <TouchableOpacity
                    onPress={() => {
                      setIsAddingPortfolio(false);
                      setNewPortfolioType('');
                      setNewPortfolioUrl('');
                    }}
                    className='flex-1 bg-gray-200 rounded-lg px-4 py-2 items-center mr-2'
                    activeOpacity={0.7}
                  >
                    <Text className='text-gray-700 font-semibold'>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmAddPortfolio}
                    className='flex-1 bg-purple-600 rounded-lg px-4 py-2 items-center ml-2'
                    activeOpacity={0.7}
                    disabled={!newPortfolioType || !newPortfolioUrl}
                  >
                    <Text className='text-white font-semibold'>추가</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!isAddingPortfolio && (
              <TouchableOpacity
                onPress={handleAddPortfolio}
                className='bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 items-center mb-3 mt-4'
                activeOpacity={0.7}
              >
                <View className='flex-row items-center'>
                  <Ionicons
                    name='add-circle-outline'
                    size={20}
                    color='#8130FF'
                  />
                  <Text className='text-purple-700 font-semibold ml-2'>
                    포트폴리오 추가
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View className='flex-row'>
              <TouchableOpacity
                onPress={handleCancelEditPortfolios}
                className='flex-1 bg-gray-200 rounded-xl px-6 py-3 items-center mr-2'
                activeOpacity={0.7}
              >
                <Text className='text-gray-700 font-semibold'>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePortfolios}
                className='flex-1 bg-purple-600 rounded-xl px-6 py-3 items-center ml-2'
                activeOpacity={0.7}
                disabled={isSavingPortfolios}
              >
                {isSavingPortfolios ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text className='text-white font-semibold'>저장</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GuideProfileScreen;
