import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
import { useAuth } from '@/hooks/useAuth';
import { getGuideProfile } from '@/services/guideProfiles';
import { GuideProfileGetData, Portfolio } from '@/types/guideProfiles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useSegments } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  // 가이드 프로필 조회
  useEffect(() => {
    const fetchGuideProfile = async () => {
      // guideProfileId가 없으면 조회하지 않음
      if (!guideProfileId) {
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await getGuideProfile(guideProfileId, 0);
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
    };

    fetchGuideProfile();
  }, [guideProfileId]);

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

  const handleEditProfile = () => {
    // TODO: 프로필 편집 화면으로 이동하는 로직 추가
  };

  const handleSessionPress = (sessionId: number) => {
    // 현재 경로에 맞는 세션 상세 페이지로 이동
    // 세션 상세 → 가이드 프로필 → 세션 상세 형태로 왔다갔다 가능하도록 구현
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

      {/* 프로필 정보 */}
      <View className='bg-white mx-5 mt-5 rounded-2xl p-6 shadow-sm'>
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center flex-1'>
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
                  size={64}
                  color='#9CA3AF'
                />
              )}
            </View>
            <Text className='text-2xl font-bold text-gray-900'>
              {guideInfo.nickname}
            </Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity
              className='bg-purple-50 border border-purple-200 rounded-xl py-2 px-4'
              onPress={handleEditProfile}
            >
              <Text className='text-purple-700 font-semibold text-base'>
                프로필 편집
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 가이드 소개 */}
        {guideInfo.bio && (
          <View className='mb-4'>
            <Text className='text-lg font-semibold text-gray-900 mb-2'>
              가이드 소개
            </Text>
            <Text className='text-base text-gray-600'>{guideInfo.bio}</Text>
          </View>
        )}

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
        {guideInfo.portfolios && guideInfo.portfolios.length > 0 && (
          <View className='border-t border-gray-100 pt-4'>
            <Text className='text-lg font-semibold text-gray-900 mb-2'>
              포트폴리오
            </Text>
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
          </View>
        )}
      </View>

      <ScrollView
        className='flex-1 mt-5'
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 모집 중인 세션 목록 */}
        <View className='mx-5 mb-5'>
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
                      {session.title}
                    </Text>
                    <Text className='text-sm text-gray-600 mb-2'>
                      {session.startDate} ~ {session.endDate}
                    </Text>
                    <Text className='text-sm text-gray-500' numberOfLines={1}>
                      {session.regionIds
                        .map((id) => REGION_ID_TO_NAME_MAP[id])
                        .filter(Boolean)
                        .join(', ')}
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
    </View>
  );
};

export default GuideProfileScreen;
