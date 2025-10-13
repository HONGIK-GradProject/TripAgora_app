import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { deleteSession } from '@/services/sessions';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/**
 * 모집 중인 여행의 상세 정보를 보여주는 화면입니다.
 * 제목, 소개, 지역, 태그, 일정 등을 확인하고 모집 취소/확정 기능을 제공합니다.
 */
const RecruitmentDetailContent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  // 세션 상세 정보 가져오기
  const sessionDetails = useSessionDetails();
  const {
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
    isLoading = true,
    refetch = () => {},
  } = sessionDetails || {};

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 모집 취소 기능
  const handleCancelRecruitment = () => {
    Alert.alert('모집 취소', '정말로 모집을 취소하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: async () => {
          if (!id) {
            Toast.show({
              type: 'error',
              text1: '세션 ID가 없습니다.',
            });
            return;
          }

          try {
            const success = await deleteSession(parseInt(id));

            if (success) {
              Toast.show({
                type: 'success',
                text1: '모집이 취소되었습니다.',
              });
              router.push('/guide/session');
            } else {
              Toast.show({
                type: 'error',
                text1: '모집 취소에 실패했습니다.',
              });
            }
          } catch (error) {
            console.error('세션 삭제 에러:', error);
            Toast.show({
              type: 'error',
              text1: '모집 취소 중 오류가 발생했습니다.',
            });
          }
        },
      },
    ]);
  };

  // 모집 확정 기능
  const handleConfirmRecruitment = () => {
    Alert.alert(
      '모집 확정',
      '모집을 확정하시겠습니까? 확정 후에는 참가자를 추가할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            // TODO: 모집 확정 API 호출
            Alert.alert('모집이 확정되었습니다.');
            refetch();
          },
        },
      ]
    );
  };

  // 로딩 중일 때
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View style={styles.coverContainer}>
          {/* 배경 이미지 */}
          {imageUrls[0] ? (
            <Image source={{ uri: imageUrls[0] }} style={styles.coverImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name='image-outline' size={60} color='#9CA3AF' />
              <Text style={styles.placeholderText}>이미지 없음</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>

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
              <Text style={styles.statusText}>
                {status === 'RECRUITING' && '모집중'}
                {status === 'RECRUITMENT_CLOSED' && '모집마감'}
                {status === 'IN_PROGRESS' && '진행중'}
                {status === 'COMPLETED' && '완료'}
              </Text>
            </View>
          </View>

          {/* 날짜와 참가자 수 */}
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

          {/* 지역 */}
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

        <View style={styles.divider} />

        {/* 설명 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 소개</Text>
          <Text style={styles.description}>{content}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed top action bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/guide/session')}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='share-outline' size={20} color='#000' />
          </TouchableOpacity>
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
        </View>
      </View>

      {/* 하단 버튼들 */}
      <View style={styles.bottomActionContainer}>
        {status === 'RECRUITING' && (
          <>
            <TouchableOpacity
              style={[styles.ctaButton, styles.secondaryButton]}
              onPress={handleCancelRecruitment}
            >
              <Text style={styles.secondaryButtonText}>모집 취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaButton, styles.primaryButton]}
              onPress={handleConfirmRecruitment}
            >
              <Text style={styles.primaryButtonText}>모집 확정</Text>
            </TouchableOpacity>
          </>
        )}
        {status === 'RECRUITMENT_CLOSED' && (
          <TouchableOpacity
            style={[styles.ctaButton, styles.primaryButton]}
            onPress={() => {
              // TODO: 여행 시작 API 호출
              Alert.alert('여행이 시작되었습니다!');
              refetch();
            }}
          >
            <Text style={styles.primaryButtonText}>여행 시작</Text>
          </TouchableOpacity>
        )}
        {status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={[styles.ctaButton, styles.primaryButton]}
            onPress={() => {
              // TODO: 여행 완료 API 호출
              Alert.alert('여행이 완료되었습니다!');
              refetch();
            }}
          >
            <Text style={styles.primaryButtonText}>여행 완료</Text>
          </TouchableOpacity>
        )}
        {status === 'COMPLETED' && (
          <View style={[styles.ctaButton, styles.completedButton]}>
            <Ionicons name='checkmark-circle' size={20} color='#10B981' />
            <Text style={styles.completedButtonText}>
              여행이 완료되었습니다
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const SessionDetailScreen: React.FC = () => {
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
      <RecruitmentDetailContent />
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
    height: 250,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
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
    backgroundColor: '#8130FF',
  },
  statusClosed: {
    backgroundColor: '#F59E0B',
  },
  statusInProgress: {
    backgroundColor: '#10B981',
  },
  statusCompleted: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: '#FFFFFF',
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
    marginBottom: 10,
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
});

export default SessionDetailScreen;
