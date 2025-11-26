import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { Image } from 'expo-image';
import { RelativePathString, router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import CustomImagePicker from '@/components/ui/ImagePicker';
import { useAuth } from '@/hooks/useAuth';
import { deleteUserAccount, setProfileImage } from '@/services/users';
import { UserRole } from '@/types/users';

const MyPageScreen: React.FC = () => {
  const { user, setUser, switchUserRole, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editingNickname, setEditingNickname] = useState('');
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmNickname, setDeleteConfirmNickname] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 유효한 프로필 이미지 URL 계산
  const profileImageUrl = useMemo(() => {
    const uri = user?.profileImageUrl;
    return uri && uri.trim() !== '' ? uri : null;
  }, [user?.profileImageUrl]);

  // 이미지 URL이 변경될 때 에러 상태 리셋
  useEffect(() => {
    setImageLoadError(false);
  }, [profileImageUrl]);

  const handleSwitchUserRole = async () => {
    const currentRole = user?.role;
    const targetRole: UserRole = currentRole === 'GUIDE' ? 'TRAVELER' : 'GUIDE';
    await switchUserRole(targetRole);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeleteConfirmNickname('');
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmNickname('');
  };

  const handleConfirmDelete = async () => {
    if (!user?.nickname) {
      showToast('error', '오류', '닉네임 정보를 불러올 수 없습니다.');
      return;
    }

    if (deleteConfirmNickname.trim() !== user.nickname.trim()) {
      showToast('error', '닉네임 불일치', '닉네임이 정확하지 않습니다.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const result = await deleteUserAccount();
      if (result) {
        showToast(
          'success',
          '회원 탈퇴가 완료되었습니다.',
          '이용해주셔서 감사합니다.'
        );
        setShowDeleteModal(false);
        router.replace('/login');
      } else {
        showToast('error', '회원 탈퇴 실패', '다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      showToast('error', '회원 탈퇴 실패', '다시 시도해주세요.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const isDeleteButtonEnabled =
    user?.nickname && deleteConfirmNickname.trim() === user.nickname.trim();

  const handleSetProfileImage = async (uri: string | null) => {
    if (!uri) return;

    setIsUploadingImage(true);
    try {
      const newProfileImageUrl = await setProfileImage(uri);
      if (newProfileImageUrl) {
        setUser((prev: any) =>
          prev ? { ...prev, profileImageUrl: newProfileImageUrl } : null
        );
        showToast('success', '프로필 사진이 변경되었습니다.');
      }
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message || '프로필 사진 업로드에 실패했습니다.'
        : '프로필 사진 업로드에 실패했습니다.';

      console.error('프로필 이미지 업로드 실패:', error);

      showToast('error', '프로필 사진 업로드 실패', errorMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleNicknamePress = () => {
    if (!user?.nickname) return;

    setIsEditingNickname(true);
    setEditingNickname(user.nickname);
  };

  const handleNicknameSave = async () => {
    const trimmedNickname = editingNickname.trim();
    if (!trimmedNickname || trimmedNickname === user?.nickname) {
      setIsEditingNickname(false);
      return;
    }

    setIsUpdatingNickname(true);
    try {
      const { usersApi } = await import('@/api/users');
      await usersApi.setNickname(trimmedNickname);

      setUser((prev: any) =>
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
    });
  };

  const getRoleDisplayText = () => {
    return user?.role === 'GUIDE' ? '여행자로 전환하기' : '가이드로 전환하기';
  };

  const handleEditTags = () => {
    router.push(
      `/(app)/${user?.role.toLowerCase()}/my-page/edit-tags` as RelativePathString
    );
  };

  return (
    <View className='flex-1 bg-gray-50' style={{ paddingTop: insets.top }}>
      {/* 프로필 섹션 */}
      <View className='bg-white mx-5 mt-5 rounded-2xl p-6 shadow-sm'>
        <View className='items-center'>
          <CustomImagePicker
            onImageSelected={handleSetProfileImage}
            aspect={[1, 1]}
            disabled={isUploadingImage}
          >
            <View className='w-24 h-24 rounded-full bg-gray-100 justify-center items-center shadow-sm relative'>
              {isUploadingImage ? (
                <View className='absolute inset-0 justify-center items-center bg-black/30 rounded-full'>
                  <ActivityIndicator size='small' color='#fff' />
                </View>
              ) : null}
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
              <TouchableOpacity onPress={handleNicknamePress}>
                <View className='flex-row items-center'>
                  <Text className='text-2xl font-bold text-gray-900'>
                    {user?.nickname || '닉네임 없음'}
                  </Text>
                  {user?.nickname && (
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
              {user?.role === 'GUIDE' ? '가이드' : '여행자'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className='rounded-xl py-3 px-4 flex-row items-center justify-center'
          style={{
            backgroundColor: '#E6E9FF',
            borderWidth: 1,
            borderColor: '#C5CCFF',
          }}
          onPress={handleSwitchUserRole}
        >
          <Ionicons name='swap-horizontal' size={20} color='#5B67F5' />
          <Text className='font-semibold ml-2' style={{ color: '#5B67F5' }}>
            {getRoleDisplayText()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 섹션 */}
      <ScrollView
        className='flex-1 mt-5'
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <View className='mx-5'>
          <View className='bg-white rounded-2xl shadow-sm overflow-hidden'>
            <TouchableOpacity
              className='flex-row items-center py-4 px-6 border-b border-gray-100'
              onPress={handleEditTags}
            >
              <View
                className='w-10 h-10 rounded-full items-center justify-center mr-4'
                style={{ backgroundColor: '#F3ECFF' }}
              >
                <Ionicons name='heart' size={20} color='#7C3AED' />
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

      {/* 회원 탈퇴 확인 모달 */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType='fade'
        onRequestClose={handleCloseDeleteModal}
      >
        <View className='flex-1 bg-black/50'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View className='flex-1 justify-center items-center px-5'>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
              >
                <View className='bg-white rounded-3xl p-6 w-full max-w-md'>
                  {/* 경고 아이콘 */}
                  <View className='items-center mb-4'>
                    <View className='w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-3'>
                      <Ionicons name='warning' size={32} color='#EF4444' />
                    </View>
                    <Text className='text-2xl font-bold text-gray-900 mb-2'>
                      회원 탈퇴
                    </Text>
                  </View>

                  {/* 안내 메시지 */}
                  <View className='mb-6'>
                    <Text className='text-base text-gray-700 mb-3 leading-6'>
                      정말 탈퇴하시겠습니까?
                    </Text>
                    <View className='bg-red-50 border border-red-200 rounded-xl p-4'>
                      <Text className='text-sm text-red-800 font-semibold mb-2'>
                        탈퇴 시 주의사항:
                      </Text>
                      <Text className='text-sm text-red-700 leading-5'>
                        • 작성한 여행 계획 및 모집 중인 여행이 모두 삭제됩니다
                        {'\n'}• 여행 참여 정보 및 예약, 찜 정보가 모두
                        삭제됩니다{'\n'}• 삭제된 데이터는 복구할 수 없습니다
                      </Text>
                    </View>
                  </View>

                  {/* 닉네임 확인 입력 */}
                  <View className='mb-6'>
                    <Text className='text-sm font-semibold text-gray-700 mb-2'>
                      탈퇴를 확인하려면 본인의 닉네임을 정확히 입력하세요:
                    </Text>
                    <TextInput
                      value={deleteConfirmNickname}
                      onChangeText={setDeleteConfirmNickname}
                      placeholder={`${user?.nickname || '닉네임'}`}
                      placeholderTextColor='#6B7280'
                      className='border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50'
                      autoCapitalize='none'
                      autoCorrect={false}
                      editable={!isDeletingAccount}
                    />
                  </View>

                  {/* 버튼 */}
                  <View className='flex-row gap-3'>
                    <TouchableOpacity
                      onPress={handleCloseDeleteModal}
                      disabled={isDeletingAccount}
                      className='flex-1 bg-gray-100 rounded-xl py-4 items-center'
                      activeOpacity={0.7}
                    >
                      <Text className='text-gray-700 font-semibold text-base'>
                        취소
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleConfirmDelete}
                      disabled={!isDeleteButtonEnabled || isDeletingAccount}
                      className={`flex-1 rounded-xl py-4 items-center ${
                        isDeleteButtonEnabled && !isDeletingAccount
                          ? 'bg-red-600'
                          : 'bg-gray-300'
                      }`}
                      activeOpacity={0.7}
                    >
                      {isDeletingAccount ? (
                        <Text className='text-white font-semibold text-base'>
                          처리 중...
                        </Text>
                      ) : (
                        <Text className='text-white font-semibold text-base'>
                          탈퇴하기
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default MyPageScreen;
