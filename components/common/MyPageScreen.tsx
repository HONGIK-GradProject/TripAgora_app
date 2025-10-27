import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { authApi } from '@/api/auth';
import CustomImagePicker from '@/components/ui/ImagePicker';
import { useAuth } from '@/hooks/useAuth';
import {
  deleteUserAccount,
  getUserInfo,
  setProfileImage,
} from '@/services/users';
import { UserGetMeData } from '@/types/users';

interface MyPageScreenProps {
  userRole: 'guide' | 'traveler';
}

const MyPageScreen: React.FC<MyPageScreenProps> = ({ userRole }) => {
  const { switchUserRole } = useAuth();
  const insets = useSafeAreaInsets();
  const [userInfo, setUserInfo] = useState<UserGetMeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editingNickname, setEditingNickname] = useState('');
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

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
        showToast(
          'error',
          '사용자 정보를 불러오는데 실패했습니다.',
          '다시 시도해주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const handleSwitchUserRole = async () => {
    const targetRole = userRole === 'guide' ? 'traveler' : 'guide';
    await switchUserRole(targetRole);
  };

  const handleSignOut = async () => {
    await authApi.signOut();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteUserAccount();
              if (result) {
                showToast(
                  'success',
                  '회원 탈퇴가 완료되었습니다.',
                  '이용해주셔서 감사합니다.'
                );
                router.replace('/login');
              } else {
                showToast('error', '회원 탈퇴 실패', '다시 시도해주세요.');
              }
            } catch (error) {
              console.error('회원 탈퇴 중 오류 발생:', error);
              showToast('error', '회원 탈퇴 실패', '다시 시도해주세요.');
            }
          },
        },
      ]
    );
  };

  const handleSetProfileImage = async (uri: string | null) => {
    if (!uri) return;

    try {
      const newProfileImageUrl = await setProfileImage(uri);
      if (newProfileImageUrl) {
        setUserInfo((prev) =>
          prev ? { ...prev, profileImageUrl: newProfileImageUrl } : null
        );
      }
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message || '프로필 사진 업로드에 실패했습니다.'
        : '프로필 사진 업로드에 실패했습니다.';

      console.error('프로필 이미지 업로드 실패:', error);

      showToast('error', '프로필 사진 업로드 실패', errorMessage);
    }
  };

  const handleNicknamePress = () => {
    if (isLoading || !userInfo?.nickname) return;

    setIsEditingNickname(true);
    setEditingNickname(userInfo.nickname);
  };

  const handleNicknameSave = async () => {
    const trimmedNickname = editingNickname.trim();
    if (!trimmedNickname || trimmedNickname === userInfo?.nickname) {
      setIsEditingNickname(false);
      return;
    }

    setIsUpdatingNickname(true);
    try {
      const { usersApi } = await import('@/api/users');
      await usersApi.setNickname(trimmedNickname);

      setUserInfo((prev) =>
        prev ? { ...prev, nickname: trimmedNickname } : null
      );

      setIsEditingNickname(false);
      showToast('success', '닉네임이 변경되었습니다.');
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message || '닉네임 변경에 실패했습니다.'
        : '닉네임 변경에 실패했습니다.';

      console.error('닉네임 변경 실패:', error);

      showToast('error', '닉네임 변경 실패', errorMessage);
    } finally {
      setIsUpdatingNickname(false);
    }
  };

  const handleNicknameCancel = () => {
    setIsEditingNickname(false);
    setEditingNickname('');
  };

  const showToast = (
    type: 'success' | 'error',
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const getRoleDisplayText = () => {
    return userRole === 'guide' ? '여행자로 전환하기' : '가이드로 전환하기';
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

          {/* 닉네임 영역 */}
          <View className='mt-4 items-center'>
            {isEditingNickname ? (
              <View className='flex-row items-center'>
                <TextInput
                  value={editingNickname}
                  onChangeText={setEditingNickname}
                  className='text-2xl font-bold text-gray-900 text-center border-b border-gray-300 px-2 py-1 min-w-[120px]'
                  maxLength={20}
                  autoFocus
                  selectTextOnFocus
                />
                <TouchableOpacity
                  onPress={handleNicknameSave}
                  disabled={isUpdatingNickname}
                  className='ml-2 p-1'
                >
                  <Ionicons
                    name={
                      isUpdatingNickname ? 'hourglass-outline' : 'checkmark'
                    }
                    size={20}
                    color={isUpdatingNickname ? '#9CA3AF' : '#10B981'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNicknameCancel}
                  disabled={isUpdatingNickname}
                  className='ml-1 p-1'
                >
                  <Ionicons
                    name='close'
                    size={20}
                    color={isUpdatingNickname ? '#9CA3AF' : '#EF4444'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleNicknamePress}
                disabled={isLoading}
              >
                <View className='flex-row items-center'>
                  <Text className='text-2xl font-bold text-gray-900'>
                    {isLoading
                      ? '로딩 중...'
                      : userInfo?.nickname || '닉네임 없음'}
                  </Text>
                  {!isLoading && userInfo?.nickname && (
                    <Ionicons
                      name='pencil'
                      size={16}
                      color='#9CA3AF'
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View className='flex-row items-center mt-2 mb-4'>
            <Text className='text-gray-600 ml-1 text-base'>
              {userRole === 'guide' ? '가이드' : '여행자'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className='bg-purple-50 border border-purple-200 rounded-xl py-3 px-4 flex-row items-center justify-center'
          onPress={handleSwitchUserRole}
        >
          <Ionicons name='swap-horizontal' size={20} color='#7C3AED' />
          <Text className='text-purple-700 font-semibold ml-2'>
            {getRoleDisplayText()}
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

            <TouchableOpacity
              className='flex-row items-center py-4 px-6'
              onPress={handleDeleteAccount}
            >
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

export default MyPageScreen;
