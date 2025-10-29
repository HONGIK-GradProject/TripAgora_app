import {
  createNotice,
  deleteNotice,
  getNoticeDetail,
  getNoticeList,
  updateNotice,
} from '@/services/notices';
import { NoticeInfo } from '@/types/notices';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface AnnounceScreenProps {
  userType?: 'guide' | 'traveler';
}

/**
 * 일행에게 공지를 발송하고 이전 공지 목록을 보여주는 화면입니다.
 * 가이드가 세션 참여자들에게 공지사항을 전달할 수 있습니다.
 * userType이 traveler인 경우 공지 작성 및 수정/삭제 기능이 숨겨집니다.
 */
const AnnounceScreen: React.FC<AnnounceScreenProps> = ({
  userType = 'guide',
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isTraveler = userType === 'traveler';

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notices, setNotices] = useState<NoticeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);
  const [noticeDetails, setNoticeDetails] = useState<Record<number, string>>(
    {}
  );
  const [loadingDetails, setLoadingDetails] = useState<Set<number>>(new Set());
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 공지 목록 조회
  const fetchNotices = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getNoticeList(parseInt(id), 0);
      setNotices(data?.notices || []);
    } catch (err) {
      console.error('공지 목록 조회 에러:', err);
      setError('공지 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // 컴포넌트 마운트 시 공지 목록 조회
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // 공지 상세 조회
  const fetchNoticeDetail = useCallback(
    async (noticeId: number) => {
      if (!id || noticeDetails[noticeId]) return; // 이미 로드된 경우 스킵

      try {
        setLoadingDetails((prev) => new Set(prev).add(noticeId));
        const data = await getNoticeDetail(parseInt(id), noticeId);
        setNoticeDetails((prev) => ({
          ...prev,
          [noticeId]: data?.content || '',
        }));
      } catch (err) {
        console.error('공지 상세 조회 에러:', err);
        Toast.show({
          type: 'error',
          text1: '공지 상세 조회 실패',
          text2: '다시 시도해주세요.',
        });
      } finally {
        setLoadingDetails((prev) => {
          const newSet = new Set(prev);
          newSet.delete(noticeId);
          return newSet;
        });
      }
    },
    [id, noticeDetails]
  );

  // 공지 항목 토글
  const toggleNotice = useCallback(
    (noticeId: number) => {
      if (expandedNoticeId === noticeId) {
        setExpandedNoticeId(null);
      } else {
        setExpandedNoticeId(noticeId);
        fetchNoticeDetail(noticeId);
      }
    },
    [expandedNoticeId, fetchNoticeDetail]
  );

  // 공지 발송 처리
  const handleSendAnnouncement = async () => {
    if (!announcementTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: '공지 제목을 입력해주세요',
      });
      return;
    }

    if (!announcement.trim()) {
      Toast.show({
        type: 'error',
        text1: '공지 내용을 입력해주세요',
      });
      return;
    }

    if (!id) {
      Toast.show({
        type: 'error',
        text1: '세션 정보를 찾을 수 없습니다',
      });
      return;
    }

    // 수정 모드인 경우
    if (editingNoticeId) {
      Alert.alert('공지 수정', '공지를 수정하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '수정',
          onPress: async () => {
            try {
              setIsUpdating(true);

              await updateNotice(
                parseInt(id),
                editingNoticeId,
                announcementTitle.trim(),
                announcement.trim()
              );

              // 공지 수정 후 목록 새로고침
              await fetchNotices();
              setAnnouncementTitle('');
              setAnnouncement('');
              setEditingNoticeId(null);

              Toast.show({
                type: 'success',
                text1: '공지가 수정되었습니다',
              });
            } catch (error) {
              console.error('공지 수정 에러:', error);
              Toast.show({
                type: 'error',
                text1: '공지 수정 실패',
                text2: '다시 시도해주세요.',
              });
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]);
      return;
    }

    // 새 공지 작성
    Alert.alert('공지 발송', '일행에게 공지를 발송하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '발송',
        onPress: async () => {
          try {
            setIsSubmitting(true);

            // 공지 작성 API 호출
            const result = await createNotice(
              parseInt(id),
              announcementTitle.trim(),
              announcement.trim()
            );

            if (result) {
              // 공지 발송 후 목록 새로고침
              await fetchNotices();
              setAnnouncementTitle('');
              setAnnouncement('');

              Toast.show({
                type: 'success',
                text1: '공지가 발송되었습니다',
                text2: '일행들에게 공지사항이 전달되었습니다.',
              });
            }
          } catch (error) {
            console.error('공지 발송 에러:', error);
            Toast.show({
              type: 'error',
              text1: '공지 발송 실패',
              text2: '다시 시도해주세요.',
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  // 공지 수정 모드로 전환
  const handleEditNotice = async (noticeId: number) => {
    try {
      const data = await getNoticeDetail(parseInt(id!), noticeId);
      if (data) {
        setAnnouncementTitle(data.title);
        setAnnouncement(data.content);
        setEditingNoticeId(noticeId);
        // 수정할 공지로 스크롤
        // 이 부분은 필요시 구현 가능
      }
    } catch (error) {
      console.error('공지 상세 조회 에러:', error);
      Toast.show({
        type: 'error',
        text1: '공지 정보를 불러오는데 실패했습니다',
      });
    }
  };

  // 공지 수정 취소
  const handleCancelEdit = () => {
    setAnnouncementTitle('');
    setAnnouncement('');
    setEditingNoticeId(null);
  };

  // 공지 삭제
  const handleDeleteNotice = (noticeId: number) => {
    Alert.alert('공지 삭제', '정말 이 공지를 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteNotice(parseInt(id!), noticeId);
            await fetchNotices();
            Toast.show({
              type: 'success',
              text1: '공지가 삭제되었습니다',
            });
          } catch (error) {
            console.error('공지 삭제 에러:', error);
            Toast.show({
              type: 'error',
              text1: '공지 삭제 실패',
              text2: '다시 시도해주세요.',
            });
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.title}>일행에게 공지하기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 공지 작성 영역 - 가이드만 표시 */}
        {!isTraveler && (
          <View style={styles.writeSection}>
            {/* 제목 입력 */}
            <View style={styles.titleInputContainer}>
              <TextInput
                style={styles.titleInput}
                value={announcementTitle}
                onChangeText={setAnnouncementTitle}
                placeholder='제목을 입력하세요'
                placeholderTextColor='#999999'
                maxLength={50}
              />
              <Text style={styles.titleCharacterCount}>
                {announcementTitle.length}/50
              </Text>
            </View>

            {/* 내용 입력 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={announcement}
                onChangeText={setAnnouncement}
                placeholder='내용을 입력하세요...'
                placeholderTextColor='#999999'
                multiline
                textAlignVertical='top'
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {announcement.length}/500
              </Text>
            </View>

            {/* 발송/수정 버튼 */}
            <View style={styles.sendButtonContainer}>
              {editingNoticeId && (
                <TouchableOpacity
                  style={[styles.cancelButton, { marginBottom: 8 }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>수정 취소</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!announcementTitle.trim() ||
                    !announcement.trim() ||
                    isSubmitting ||
                    isUpdating) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handleSendAnnouncement}
                disabled={
                  !announcementTitle.trim() ||
                  !announcement.trim() ||
                  isSubmitting ||
                  isUpdating
                }
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    (!announcementTitle.trim() ||
                      !announcement.trim() ||
                      isSubmitting ||
                      isUpdating) &&
                      styles.sendButtonTextDisabled,
                  ]}
                >
                  {isUpdating
                    ? '수정 중...'
                    : isSubmitting
                    ? '발송 중...'
                    : editingNoticeId
                    ? '공지 수정하기'
                    : '공지 발송하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 공지 목록 */}
        <View
          style={[
            styles.announcementsSection,
            isTraveler && styles.announcementsSectionTraveler,
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>공지 목록을 불러오는 중...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchNotices}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : notices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>아직 발송된 공지가 없습니다.</Text>
            </View>
          ) : (
            notices.map((notice) => (
              <View key={notice.noticeId} style={styles.announcementCard}>
                <View style={styles.announcementHeaderContainer}>
                  <TouchableOpacity
                    style={styles.announcementHeader}
                    onPress={() => toggleNotice(notice.noticeId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatarContainer}>
                      <Ionicons name='megaphone' size={20} color='#8130FF' />
                    </View>
                    <View style={styles.announcementContent}>
                      <Text style={styles.announcementText}>
                        {notice.title}
                      </Text>
                      <Text style={styles.announcementTime}>
                        {new Date(notice.createdAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View style={styles.expandIcon}>
                      <Ionicons
                        name={
                          expandedNoticeId === notice.noticeId
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={20}
                        color='#9CA3AF'
                      />
                    </View>
                  </TouchableOpacity>
                  {/* 수정/삭제 버튼 - 가이드만 표시 */}
                  {!isTraveler && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditNotice(notice.noticeId)}
                        disabled={isDeleting || !!editingNoticeId}
                      >
                        <Ionicons
                          name='create-outline'
                          size={18}
                          color='#8130FF'
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteNotice(notice.noticeId)}
                        disabled={isDeleting || !!editingNoticeId}
                      >
                        <Ionicons
                          name='trash-outline'
                          size={18}
                          color='#EF4444'
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {expandedNoticeId === notice.noticeId && (
                  <View style={styles.announcementDetail}>
                    {loadingDetails.has(notice.noticeId) ? (
                      <View style={styles.detailLoading}>
                        <Text style={styles.detailLoadingText}>
                          상세 내용을 불러오는 중...
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.detailContent} numberOfLines={0}>
                        {noticeDetails[notice.noticeId] ||
                          '상세 내용을 불러올 수 없습니다.'}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  writeSection: {
    paddingHorizontal: 20,
    paddingTop: 100, // 상단 바 공간 확보
    paddingBottom: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F4F4F4',
  },
  titleInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    position: 'relative',
    minHeight: 48,
  },
  titleInput: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    paddingRight: 60,
  },
  titleCharacterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: '#9CA3AF',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    minHeight: 120,
    position: 'relative',
  },
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    flex: 1,
    minHeight: 80,
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: '#9CA3AF',
  },
  sendButtonContainer: {
    marginTop: 16,
    paddingHorizontal: 0,
  },
  sendButton: {
    backgroundColor: '#8130FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#9CA3AF',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  announcementsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40, // 하단 여백 추가
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  announcementHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  avatarContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  expandIcon: {
    marginLeft: 8,
  },
  announcementDetail: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  detailLoading: {
    padding: 20,
    alignItems: 'center',
  },
  detailLoadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
      textAlignVertical: 'top',
    }),
  },
  announcementText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  announcementTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8130FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  announcementsSectionTraveler: {
    paddingTop: 100, // 공지 작성 영역이 없을 때 상단 공간 확보
  },
});

export default AnnounceScreen;
