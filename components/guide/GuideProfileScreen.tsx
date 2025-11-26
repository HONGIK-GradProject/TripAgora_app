import CustomKeyboardAvoidingView from '@/components/CustomKeyboardAvoidingView';
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
import { router, useSegments } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
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
        profileImageUrl: guideProfile.userImageUrl,
        bannerImageUrl: guideProfile.guideImageUrl,
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
        bannerImageUrl: '',
        bio: '',
        tags: [],
        portfolios: [],
      };
    }
    // 프로필 데이터가 없는 경우 기본값
    return {
      nickname: '가이드',
      profileImageUrl: '',
      bannerImageUrl: '',
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
            userImageUrl: user?.profileImageUrl,
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
        // guideImageUrl 또는 imageUrl 중 하나라도 있으면 사용
        const newImageUrl = result.guideImageUrl || result.imageUrl;

        if (newImageUrl) {
          setGuideProfile((prev) => {
            if (prev) {
              return {
                ...prev,
                guideImageUrl: newImageUrl,
              };
            }
            // 자신의 프로필인 경우 초기 데이터 생성
            return {
              nickname: user?.nickname || '닉네임 없음',
              guideImageUrl: newImageUrl,
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
    setIsAddingPortfolio(false);
    setNewPortfolioType('');
    setNewPortfolioUrl('');
    setEditingPortfolioIndex(null);
    setEditingPortfolioType('');
    setEditingPortfolioUrl('');
  };

  // 포트폴리오 추가 상태
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolioType, setNewPortfolioType] = useState<
    Portfolio['type'] | ''
  >('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // 포트폴리오 수정 상태
  const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<
    number | null
  >(null);
  const [editingPortfolioType, setEditingPortfolioType] = useState<
    Portfolio['type'] | ''
  >('');
  const [editingPortfolioUrl, setEditingPortfolioUrl] = useState('');

  // 포트폴리오 타입 목록
  const PORTFOLIO_TYPES: Portfolio['type'][] = [
    'FACEBOOK',
    'INSTAGRAM',
    'TWITTER',
    'YOUTUBE',
    'WEBSITE',
  ];

  // 포트폴리오 추가
  const handleAddPortfolio = () => {
    setIsAddingPortfolio(true);
    setEditingPortfolioIndex(null);
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

  // 포트폴리오 수정 시작
  const handleStartEditPortfolio = (index: number) => {
    const portfolio = editingPortfolios[index];
    setEditingPortfolioIndex(index);
    setEditingPortfolioType(portfolio.type);
    setEditingPortfolioUrl(portfolio.url);
    setIsAddingPortfolio(false);
  };

  // 포트폴리오 수정 완료
  const handleConfirmEditPortfolio = () => {
    if (
      editingPortfolioIndex !== null &&
      editingPortfolioType &&
      editingPortfolioUrl
    ) {
      const updatedPortfolios = [...editingPortfolios];
      updatedPortfolios[editingPortfolioIndex] = {
        type: editingPortfolioType,
        url: editingPortfolioUrl,
      };
      setEditingPortfolios(updatedPortfolios);
      setEditingPortfolioIndex(null);
      setEditingPortfolioType('');
      setEditingPortfolioUrl('');
    }
  };

  // 포트폴리오 수정 취소
  const handleCancelEditPortfolio = () => {
    setEditingPortfolioIndex(null);
    setEditingPortfolioType('');
    setEditingPortfolioUrl('');
  };

  // 포트폴리오 삭제
  const handleRemovePortfolio = (index: number) => {
    setEditingPortfolios(editingPortfolios.filter((_, i) => i !== index));
    if (editingPortfolioIndex === index) {
      handleCancelEditPortfolio();
    } else if (
      editingPortfolioIndex !== null &&
      editingPortfolioIndex > index
    ) {
      setEditingPortfolioIndex(editingPortfolioIndex - 1);
    }
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
            userImageUrl: user?.profileImageUrl,
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
    const [segment1, segment2] = segments.slice(1, 3);
    const isGuideStack = segment1 === 'guide' && segment2 === 'session';
    const isTravelerTripStack = segment1 === 'traveler' && segment2 === 'trip';
    const isTravelerExploreStack =
      segment1 === 'traveler' && segment2 === 'explore';

    let sessionDetailPath: string;
    if (isGuideStack) {
      sessionDetailPath = `/guide/session/${sessionId}`;
    } else if (isTravelerTripStack) {
      sessionDetailPath = `/traveler/trip/${sessionId}`;
    } else if (isTravelerExploreStack) {
      sessionDetailPath = `/traveler/explore/${sessionId}`;
    } else {
      sessionDetailPath =
        user?.role === 'GUIDE'
          ? `/guide/session/${sessionId}`
          : `/traveler/explore/${sessionId}`;
      if (
        user?.role === 'GUIDE' &&
        segment1 === 'guide' &&
        segment2 === 'profile'
      ) {
        sessionDetailPath += '?fromProfile=true';
      }
    }

    router.push(sessionDetailPath as any);
  };

  const handlePortfolioPress = async (portfolio: Portfolio) => {
    try {
      // URL이 http:// 또는 https://로 시작하는지 확인
      let url = portfolio.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error('포트폴리오 링크 열기 실패:', error);
      Toast.show({
        type: 'error',
        text1: '링크를 열 수 없습니다',
        text2: '열 수 없는 URL이 설정되어 있습니다.',
      });
    }
  };

  const getPortfolioIcon = (type: Portfolio['type']) => {
    switch (type) {
      case 'FACEBOOK':
        return 'logo-facebook';
      case 'INSTAGRAM':
        return 'logo-instagram';
      case 'TWITTER':
        return 'logo-x'; // X 로고 아이콘
      case 'YOUTUBE':
        return 'logo-youtube';
      case 'WEBSITE':
        return 'globe-outline';
      default:
        return 'link-outline';
    }
  };

  const getPortfolioDisplayName = (type: Portfolio['type']) => {
    switch (type) {
      case 'TWITTER':
        return 'X';
      default:
        return type;
    }
  };

  // 로딩 중일 때
  if (isLoadingProfile) {
    return (
      <View
        className='flex-1 bg-gray-50 justify-center items-center'
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size='large' color='#5B67F5' />
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
    <CustomKeyboardAvoidingView>
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
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            isOwnProfile ? (
              <RefreshControl
                refreshing={isLoadingProfile}
                onRefresh={handleRefresh}
                colors={['#5B67F5']}
                tintColor='#5B67F5'
              />
            ) : undefined
          }
        >
          {/* 배너 이미지 */}
          <View className='mx-5 mt-5 relative'>
            {guideInfo.bannerImageUrl ? (
              <>
                <Image
                  key={guideInfo.bannerImageUrl}
                  source={{ uri: guideInfo.bannerImageUrl }}
                  style={{ width: '100%', height: 200, borderRadius: 16 }}
                  contentFit='cover'
                  cachePolicy='memory-disk'
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
              <View className='w-full h-52 bg-gray-100 rounded-2xl border border-dashed border-gray-300 items-center justify-center'>
                {isOwnProfile ? (
                  <TouchableOpacity
                    onPress={() => setIsEditingImage(true)}
                    activeOpacity={0.7}
                    className='items-center'
                  >
                    <Ionicons name='image-outline' size={36} color='#9CA3AF' />
                    <Text className='text-gray-500 mt-2'>
                      배너 이미지를 추가하세요
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <Ionicons name='image-outline' size={36} color='#9CA3AF' />
                    <Text className='text-gray-500 mt-2'>
                      배너 이미지가 없습니다
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>

          {/* 프로필 정보 */}
          <View className='bg-white mx-5 mt-5 rounded-2xl p-6 shadow-sm'>
            <View className='flex-row items-center mb-4'>
              <View className='w-16 h-16 rounded-full bg-gray-100 justify-center items-center shadow-sm mr-3'>
                {guideInfo.profileImageUrl ? (
                  <Image
                    source={{ uri: guideInfo.profileImageUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                    contentFit='cover'
                  />
                ) : (
                  <Ionicons
                    name='person-circle-outline'
                    size={48}
                    color='#9CA3AF'
                  />
                )}
              </View>
              <Text className='text-2xl font-bold text-gray-900'>
                {guideInfo.nickname}
              </Text>
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
                  {guideInfo.bio ||
                    (isOwnProfile ? '소개글을 작성해주세요' : '')}
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
                      className='rounded-full px-3 py-1 mr-2 mb-2 border'
                      style={{
                        backgroundColor: '#E6E9FF',
                        borderColor: '#C5CCFF',
                      }}
                    >
                      <Text
                        className='text-sm font-medium'
                        style={{ color: '#5B67F5' }}
                      >
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
              {guideInfo.portfolios?.length > 0 ? (
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
                        {getPortfolioDisplayName(portfolio.type)}
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
                모집 중인 여행
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
                        {session.regionIds?.length
                          ? session.regionIds
                              .map((id) => REGION_ID_TO_NAME_MAP[id])
                              .filter(Boolean)
                              .join(', ') || '지역 정보 없음'
                          : '지역 정보 없음'}
                      </Text>
                    </View>
                    <View
                      className='px-3 py-1 rounded-full ml-2'
                      style={{ backgroundColor: '#E6E9FF' }}
                    >
                      <Text
                        className='text-sm font-medium'
                        style={{ color: '#5B67F5' }}
                      >
                        모집 중
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className='bg-white rounded-2xl p-6 items-center justify-center shadow-sm'>
                <Ionicons name='calendar-outline' size={48} color='#9CA3AF' />
                <Text className='text-gray-500 mt-2 text-base'>
                  모집 중인 여행이 없습니다
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
                    <Text className='text-white font-semibold'>
                      이미지 선택
                    </Text>
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                    <View key={index}>
                      {editingPortfolioIndex === index ? (
                        // 수정 모드
                        <View
                          className='rounded-lg p-4 mb-2'
                          style={{ backgroundColor: '#E6E9FF' }}
                        >
                          <Text className='text-gray-900 font-semibold mb-2'>
                            포트폴리오 수정
                          </Text>
                          <View className='mb-3'>
                            <Text className='text-gray-700 text-sm mb-1'>
                              타입
                            </Text>
                            <View className='flex-row flex-wrap'>
                              {PORTFOLIO_TYPES.map((type) => (
                                <TouchableOpacity
                                  key={type}
                                  onPress={() => setEditingPortfolioType(type)}
                                  className='mr-2 mb-2 px-3 py-1 rounded-full'
                                  style={{
                                    backgroundColor:
                                      editingPortfolioType === type
                                        ? '#5B67F5'
                                        : '#FFFFFF',
                                    borderWidth:
                                      editingPortfolioType === type ? 0 : 1,
                                    borderColor: '#C5CCFF',
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Text
                                    className='text-sm'
                                    style={{
                                      color:
                                        editingPortfolioType === type
                                          ? '#FFFFFF'
                                          : '#4B5563',
                                    }}
                                  >
                                    {getPortfolioDisplayName(type)}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                          <View className='mb-3'>
                            <Text className='text-gray-700 text-sm mb-1'>
                              URL
                            </Text>
                            <TextInput
                              className='bg-white border border-gray-300 rounded-lg p-3'
                              value={editingPortfolioUrl}
                              onChangeText={setEditingPortfolioUrl}
                              placeholder='https://...'
                              placeholderTextColor='#9CA3AF'
                              autoCapitalize='none'
                              keyboardType='url'
                            />
                          </View>
                          <View className='flex-row'>
                            <TouchableOpacity
                              onPress={handleCancelEditPortfolio}
                              className='flex-1 bg-gray-200 rounded-lg px-4 py-2 items-center mr-2'
                              activeOpacity={0.7}
                            >
                              <Text className='text-gray-700 font-semibold'>
                                취소
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={handleConfirmEditPortfolio}
                              className='flex-1 rounded-lg px-4 py-2 items-center ml-2'
                              activeOpacity={0.7}
                              disabled={
                                !editingPortfolioType || !editingPortfolioUrl
                              }
                              style={{
                                backgroundColor: '#5B67F5',
                                opacity:
                                  !editingPortfolioType || !editingPortfolioUrl
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              <Text className='text-white font-semibold'>
                                저장
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        // 일반 모드
                        <View className='flex-row items-center justify-between bg-gray-50 rounded-lg p-3 mb-2'>
                          <View className='flex-row items-center flex-1'>
                            <Ionicons
                              name={getPortfolioIcon(portfolio.type)}
                              size={20}
                              color='#6B7280'
                            />
                            <View className='ml-3 flex-1'>
                              <Text className='text-gray-900 font-medium'>
                                {getPortfolioDisplayName(portfolio.type)}
                              </Text>
                              <Text
                                className='text-gray-500 text-sm'
                                numberOfLines={1}
                              >
                                {portfolio.url}
                              </Text>
                            </View>
                          </View>
                          <View className='flex-row items-center'>
                            <TouchableOpacity
                              onPress={() => handleStartEditPortfolio(index)}
                              activeOpacity={0.7}
                              className='ml-2'
                            >
                              <Ionicons
                                name='create-outline'
                                size={20}
                                color='#5B67F5'
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemovePortfolio(index)}
                              activeOpacity={0.7}
                              className='ml-2'
                            >
                              <Ionicons
                                name='trash-outline'
                                size={20}
                                color='#EF4444'
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>

                {/* 포트폴리오 추가 폼 */}
                {isAddingPortfolio && (
                  <View
                    className='rounded-lg p-4 mb-3 mt-4'
                    style={{ backgroundColor: '#E6E9FF' }}
                  >
                    <Text className='text-gray-900 font-semibold mb-2'>
                      포트폴리오 추가
                    </Text>
                    <View className='mb-3'>
                      <Text className='text-gray-700 text-sm mb-1'>타입</Text>
                      <View className='flex-row flex-wrap'>
                        {PORTFOLIO_TYPES.map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => setNewPortfolioType(type)}
                            className='mr-2 mb-2 px-3 py-1 rounded-full'
                            style={{
                              backgroundColor:
                                newPortfolioType === type
                                  ? '#5B67F5'
                                  : '#FFFFFF',
                              borderWidth: newPortfolioType === type ? 0 : 1,
                              borderColor: '#C5CCFF',
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              className='text-sm'
                              style={{
                                color:
                                  newPortfolioType === type
                                    ? '#FFFFFF'
                                    : '#4B5563',
                              }}
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
                        <Text className='text-gray-700 font-semibold'>
                          취소
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleConfirmAddPortfolio}
                        className='flex-1 rounded-lg px-4 py-2 items-center ml-2'
                        activeOpacity={0.7}
                        disabled={!newPortfolioType || !newPortfolioUrl}
                        style={{
                          backgroundColor: '#5B67F5',
                          opacity:
                            !newPortfolioType || !newPortfolioUrl ? 0.6 : 1,
                        }}
                      >
                        <Text className='text-white font-semibold'>추가</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {!isAddingPortfolio && (
                  <TouchableOpacity
                    onPress={handleAddPortfolio}
                    className='rounded-xl px-4 py-3 flex-row items-center justify-center mb-3 mt-4'
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: '#E6E9FF',
                      borderWidth: 1,
                      borderColor: '#C5CCFF',
                    }}
                  >
                    <Ionicons
                      name='add-circle-outline'
                      size={20}
                      color='#5B67F5'
                    />
                    <Text
                      className='font-semibold ml-2'
                      style={{ color: '#5B67F5' }}
                    >
                      포트폴리오 추가
                    </Text>
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
                    className='flex-1 rounded-xl px-6 py-3 items-center ml-2'
                    activeOpacity={0.7}
                    disabled={isSavingPortfolios}
                    style={{
                      backgroundColor: '#5B67F5',
                      opacity: isSavingPortfolios ? 0.7 : 1,
                    }}
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
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </CustomKeyboardAvoidingView>
  );
};

export default GuideProfileScreen;
