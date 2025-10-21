import { authApi } from '@/api/auth';
import CustomImagePicker from '@/components/ui/ImagePicker';
import { useAuth } from '@/hooks/useAuth';
import { getUserInfo, setProfileImage } from '@/services/users';
import { UserGetMeData } from '@/types/users';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const GuideMyPageScreen: React.FC = () => {
  const { switchUserRole } = useAuth();
  const insets = useSafeAreaInsets();
  const [userInfo, setUserInfo] = useState<UserGetMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  // 유효한 프로필 이미지 URL 계산
  const profileImageUrl = useMemo(() => {
    const uri = userInfo?.profileImageUrl;
    return uri && uri.trim() !== '' ? uri : null;
  }, [userInfo?.profileImageUrl]);

  // 이미지 URL이 변경될 때 에러 상태 리셋
  useEffect(() => {
    setImageLoadError(false);
  }, [profileImageUrl]);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        Toast.show({
          type: 'error',
          text1: '사용자 정보를 불러오는데 실패했습니다.',
          text2: '다시 시도해주세요.',
          position: 'bottom',
          bottomOffset: 100,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const handleSwitchUserRole = async () => {
    await switchUserRole('traveler');
  };

  const handleSignOut = async () => {
    await authApi.signOut();
    router.replace('/login');
  };

  const handleSetProfileImage = async (uri: string | null) => {
    if (!uri) {
      return;
    }

    try {
      const newProfileImageUrl = await setProfileImage(uri);
      if (newProfileImageUrl) {
        // 즉시 UI에 반영
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                profileImageUrl: newProfileImageUrl,
              }
            : null
        );
      }
    } catch (error) {
      let errorMessage = '프로필 사진 업로드에 실패했습니다.';

      if (isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
          errorMessage = serverMessage;
        }
        console.error(
          '프로필 이미지 업로드 실패:',
          error.response?.data?.message
        );
      } else {
        console.error('프로필 이미지 업로드 실패:', error);
      }

      Toast.show({
        type: 'error',
        text1: '프로필 사진 업로드 실패',
        text2: errorMessage,
        position: 'bottom',
        bottomOffset: 100,
      });
    }
  };

  return (
    <View className='flex-1 bg-gray-50' style={{ paddingTop: insets.top }}>
      {/* 프로필 섹션 */}
      <View className='bg-white mx-5 mt-5 rounded-2xl p-6 shadow-sm'>
        <View className='items-center'>
          <CustomImagePicker
            onImageSelected={handleSetProfileImage}
            aspect={[1, 1]}
          >
            <View className='w-24 h-24 rounded-full bg-gray-100 justify-center items-center shadow-sm'>
              {profileImageUrl && !imageLoadError ? (
                <Image
                  source={{ uri: profileImageUrl }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                  onError={() => {
                    setImageLoadError(true);
                  }}
                />
              ) : (
                <Ionicons
                  name='person-circle-outline'
                  size={96}
                  color='#9CA3AF'
                />
              )}
            </View>
          </CustomImagePicker>

          <Text className='text-2xl font-bold mt-4 text-gray-900'>
            {isLoading ? '로딩 중...' : userInfo?.nickname || '닉네임 없음'}
          </Text>

          <View className='flex-row items-center mt-2 mb-4'>
            <Ionicons name='star' size={16} color='#F59E0B' />
            <Text className='text-gray-600 ml-1 text-base'>
              여행 0건 · 가이드 0건
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className='bg-purple-50 border border-purple-200 rounded-xl py-3 px-4 flex-row items-center justify-center'
          onPress={handleSwitchUserRole}
        >
          <Ionicons name='swap-horizontal' size={20} color='#7C3AED' />
          <Text className='text-purple-700 font-semibold ml-2'>
            여행자 - 가이드 전환
          </Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 섹션 */}
      <ScrollView
        className='flex-1 mt-5'
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View className='mx-5'>
          <View className='bg-white rounded-2xl shadow-sm overflow-hidden'>
            <TouchableOpacity className='flex-row items-center py-4 px-6 border-b border-gray-100'>
              <View className='w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4'>
                <Ionicons name='heart' size={20} color='#3B82F6' />
              </View>
              <Text className='text-lg font-medium text-gray-900 flex-1'>
                나의 관심사 설정
              </Text>
              <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center py-4 px-6 border-b border-gray-100'>
              <View className='w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4'>
                <Ionicons name='chatbubble-outline' size={20} color='#10B981' />
              </View>
              <Text className='text-lg font-medium text-gray-900 flex-1'>
                문의하기
              </Text>
              <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row items-center py-4 px-6 border-b border-gray-100'
              onPress={handleSignOut}
            >
              <View className='w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4'>
                <Ionicons name='log-out-outline' size={20} color='#F59E0B' />
              </View>
              <Text className='text-lg font-medium text-gray-900 flex-1'>
                로그아웃
              </Text>
              <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center py-4 px-6'>
              <View className='w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4'>
                <Ionicons name='trash-outline' size={20} color='#EF4444' />
              </View>
              <Text className='text-lg font-medium text-gray-900 flex-1'>
                회원탈퇴
              </Text>
              <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideMyPageScreen;
