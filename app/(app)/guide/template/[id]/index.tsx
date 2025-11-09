import FullScreenLoader from '@/components/ui/FullScreenLoader';
import MultipleImagePicker from '@/components/ui/MultipleImagePicker';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import {
  deleteTemplate,
  setTemplateContent,
  setTemplateImageUrls,
  setTemplateTitle,
} from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 특정 여행 템플릿의 모든 상세 정보를 보여주는 화면입니다.
 * 제목, 소개, 지역, 태그, 일정 등을 확인하고 각 항목의 편집 화면으로 이동하는 기능을 제공합니다.
 */
const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    title,
    content,
    regionIds,
    tagIds,
    imageUrls,
    isEditingContent,
    isEditingTitle,
    setIsEditingContent,
    setIsEditingTitle,
    setTitle,
    setContent,
    setImageUrls,
    itineraries,
    isLoading,
    refetch,
  } = useTemplateDetails();

  // 로딩 상태 추가
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 이미지 뷰어 상태
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 이미지 캐러셀 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // 초기 로딩과 새로고침을 구분하기 위한 변수
  // 데이터가 전혀 없을 때의 로딩만 전체 화면 로딩으로 간주
  const isInitialLoading = isLoading && Object.keys(itineraries).length === 0;

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

  // 이미지가 변경될 때 현재 인덱스 초기화
  useEffect(() => {
    if (imageUrls.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [imageUrls]);

  // 스크롤 이벤트 핸들러
  const handleMomentumScrollEnd = (event: any) => {
    if (imageUrls.length <= 1) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);

    setCurrentImageIndex(index);
  };

  // 좌우 스와이프 제스처로 이미지 전환
  const goToNextImage = () => {
    if (imageUrls.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % imageUrls.length;
    scrollViewRef?.scrollTo({ x: nextIndex * screenWidth, animated: true });
    setCurrentImageIndex(nextIndex);
  };

  const goToPreviousImage = () => {
    if (imageUrls.length <= 1) return;
    const prevIndex =
      currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
    scrollViewRef?.scrollTo({ x: prevIndex * screenWidth, animated: true });
    setCurrentImageIndex(prevIndex);
  };

  // 이미지 뷰어 열기
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerVisible(true);
  };

  // 이미지 뷰어 닫기
  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  // 이미지 뷰어 스크롤 이벤트 핸들러
  const handleImageViewerMomentumScrollEnd = (event: any) => {
    if (imageUrls.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setSelectedImageIndex(index);
  };

  useFocusEffect(
    useCallback(() => {
      // The id check is still useful here before refetching
      if (id) {
        refetch();
      }
    }, [id, refetch])
  );

  const _id: number = +id;

  /**
   * 템플릿 제목의 편집 모드를 토글하고, 편집 완료 시 서버에 변경사항을 저장합니다.
   */
  const handleEditTitle = async () => {
    if (isEditingTitle) {
      setIsSavingTitle(true);
      try {
        await setTemplateTitle(_id, title);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSavingTitle(false);
      }
    }
    setIsEditingTitle((prev) => !prev);
  };

  /**
   * 템플릿 소개 내용의 편집 모드를 토글하고, 편집 완료 시 서버에 변경사항을 저장합니다.
   */
  const handleEditContent = async () => {
    if (isEditingContent) {
      setIsSavingContent(true);
      try {
        await setTemplateContent(_id, content);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSavingContent(false);
      }
    }
    setIsEditingContent((prev) => !prev);
  };

  // Location and Tags will navigate to separate edit screens; no local edit state needed

  /**
   * 현재 템플릿을 삭제할지 확인하는 경고창을 띄우고, 확인 시 삭제 API를 호출합니다.
   */
  const handleDeleteTemplate = () => {
    Alert.alert(
      '템플릿 삭제',
      '정말 템플릿을 삭제하시겠습니까? \n삭제 후엔 복구할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteTemplate(_id);
              router.back();
            } catch (error) {
              console.error(error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleSetImages = async (uris: string[]) => {
    try {
      const newImageUrls = await setTemplateImageUrls(_id, uris);
      if (newImageUrls) {
        setImageUrls(newImageUrls);
        console.log(newImageUrls);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isInitialLoading) {
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
          {/* 배경 이미지 캐러셀 */}
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

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            {isEditingTitle ? (
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholder='제목을 입력하세요'
                editable={!isSavingTitle}
              />
            ) : (
              <Text style={[styles.title, { flex: 1, marginBottom: 0 }]}>
                {title}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditTitle}
              disabled={isSavingTitle}
            >
              {isSavingTitle ? (
                <ActivityIndicator size='small' />
              ) : (
                <Text style={styles.editButtonText}>
                  {isEditingTitle ? '저장' : '편집'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name='location-outline' size={20} color='#6B7280' />
            <Text style={styles.metaText}>
              {regionIds
                .map((regionId) => REGION_ID_TO_NAME_MAP[regionId])
                .join(', ')}
            </Text>
          </View>
          <View style={styles.tagsRow}>
            {tagIds.map((tagId) => (
              <View key={tagId} style={styles.tagChip}>
                <Text style={styles.tagText}>
                  # {TAG_ID_TO_NAME_MAP[tagId]}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.editActionsRow}>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={() => router.push(`/guide/template/${id}/edit-regions`)}
            >
              <Text style={styles.editActionText}>지역 편집</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={() => router.push(`/guide/template/${id}/edit-tags`)}
            >
              <Text style={styles.editActionText}>태그 편집</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { flex: 1, marginBottom: 0 }]}>
              여행 소개
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditContent}
              disabled={isSavingContent}
            >
              {isSavingContent ? (
                <ActivityIndicator size='small' />
              ) : (
                <Text style={styles.editButtonText}>
                  {isEditingContent ? '완료' : '편집'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {isEditingContent ? (
            <TextInput
              value={content}
              onChangeText={setContent}
              style={styles.multilineInput}
              multiline
              textAlignVertical='top'
              placeholder='여행 소개를 입력하세요'
              editable={!isSavingContent}
            />
          ) : (
            <Text style={styles.description}>{content}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* 사진 섹션 */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { flex: 1, marginBottom: 0 }]}>
              사진
            </Text>
            <MultipleImagePicker onImagesSelected={handleSetImages}>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>편집</Text>
              </View>
            </MultipleImagePicker>
          </View>

          {/* 한 줄에 3개씩 이미지 표시 */}
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
              <Text style={styles.emptyPhotoText}>사진을 추가해보세요</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { flex: 1, marginBottom: 0 }]}>
              일정
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push(`/guide/template/${id}/edit-itineraries`)
              }
            >
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
          </View>
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

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed top action bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        {/** 공유 및 찜 버튼은 여행자 쪽에서 세션을 볼 때 있어야 하는 아이콘입니다.
         * 여행자 쪽에서 보는 양식을 참고하기 위해 추가해 둔 것으로, 이후 여행자 쪽 화면으로 옮길 예정입니다.
         */}
        {/* <View style={styles.rightIcons>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='share-outline' size={20} color='#000' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='heart-outline' size={20} color='#000' />
          </TouchableOpacity>
        </View> */}

        {/* 삭제 버튼 */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteTemplate}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size='small' color='#FF3B30' />
            ) : (
              <Ionicons name='trash-outline' size={20} color='#FF3B30' />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.bottomActionContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ]}
      >
        {/* <TouchableOpacity style={[styles.ctaButton, styles.secondaryButton]}>
          <Ionicons
            name='chatbubble-ellipses-outline'
            size={20}
            color='#8130FF'
          />
          <Text style={styles.secondaryButtonText}>가이드에게 문의</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>예약하기</Text> */}

        <TouchableOpacity
          style={[styles.ctaButton, styles.primaryButton]}
          onPress={() => router.push(`/guide/template/${id}/start-recruitment`)}
        >
          <Text style={styles.primaryButtonText}>
            이 템플릿으로 모집 시작하기
          </Text>
        </TouchableOpacity>
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
            <Ionicons name='close' size={30} color='#fff' />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
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

          {/* 이미지 인덱스 표시 */}
          {imageUrls.length > 1 && (
            <View style={styles.imageViewerIndicator}>
              <Text style={styles.imageViewerIndicatorText}>
                {selectedImageIndex + 1} / {imageUrls.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  coverContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#D9D9D9',
  },
  imageScrollView: {
    width: '100%',
    height: '100%',
  },
  coverImage: {
    width: Dimensions.get('window').width,
    height: '100%',
    contentFit: 'cover',
  },
  coverPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#D9D9D9',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    left: 16,
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navButtonRight: {
    left: undefined,
    right: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  photoGridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  photoGridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    contentFit: 'cover',
  },
  emptyPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginTop: 16,
  },
  emptyPhotoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewerScrollView: {
    flex: 1,
    width: '100%',
  },
  imageViewerItem: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerImage: {
    width: Dimensions.get('window').width,
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
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    marginLeft: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.3)',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#6B7280',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  subsectionHeader: {
    marginTop: 16,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
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
  divider: {
    height: 8,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3ECFF',
    borderWidth: 1,
    borderColor: '#D9C7FF',
  },
  editButtonText: {
    color: '#8130FF',
    fontSize: 14,
    fontWeight: '600',
  },
  editActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3ECFF',
    borderWidth: 1,
    borderColor: '#D9C7FF',
  },
  editActionText: {
    color: '#8130FF',
    fontSize: 14,
    fontWeight: '600',
  },
  titleInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  multilineInput: {
    marginTop: 6,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  daySelection: {
    flexDirection: 'row',
    paddingVertical: 10,
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
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    marginBottom: 10,
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
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#8130FF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F3ECFF',
    borderWidth: 1,
    borderColor: '#D9C7FF',
  },
  secondaryButtonText: {
    color: '#8130FF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default ProductDetailScreen;
