import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails';
import { setTemplateContent, setTemplateTitle } from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id?: string }>();

  // In the future, use `id` to fetch detail via API. For now, show sample.
  const {
    title,
    content,
    regionNames,
    tagNames,
    imageUrls,
    isEditingContent,
    isEditingTitle,
    setIsEditingContent,
    setIsEditingTitle,
    setTitle,
    setContent,
    itineraries,
  } = useTemplateDetails();

  if (!id) {
    return <Redirect href='/(app)/guide/product' />;
  }

  const _id: number = +id;

  const handleEditTitle = async () => {
    if (isEditingTitle) {
      await setTemplateTitle(_id, title);
    }
    setIsEditingTitle((prev) => !prev);
  };

  const handleEditContent = async () => {
    if (isEditingContent) {
      await setTemplateContent(_id, content);
    }
    setIsEditingContent((prev) => !prev);
  };

  // Location and Tags will navigate to separate edit screens; no local edit state needed

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.coverContainer}>
          {/* 배경 이미지 예시 */}
          <Image source={{ uri: imageUrls[0] }} style={styles.coverImage} />
          {/* 배경 이미지 없는 예시 (주석) */}
          {/** <View style={styles.coverPlaceholder} /> */}
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            {isEditingTitle ? (
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholder='제목을 입력하세요'
              />
            ) : (
              <Text style={[styles.title, { flex: 1, marginBottom: 0 }]}>
                {title}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditTitle}
            >
              <Text style={styles.editButtonText}>
                {isEditingTitle ? '완료' : '편집'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name='location-outline' size={20} color='#8130FF' />
            <Text style={styles.metaText}>{regionNames.join(', ')}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name='person-circle-outline' size={20} color='#8130FF' />
          </View>
          <View style={styles.tagsRow}>
            {tagNames.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.editActionsRow}>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={() => router.push(`/guide/product/${id}/edit-regions`)}
            >
              <Text style={styles.editActionText}>지역 편집</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={() => router.push(`/guide/product/${id}/edit-tags`)}
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
            >
              <Text style={styles.editButtonText}>
                {isEditingContent ? '완료' : '편집'}
              </Text>
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
            />
          ) : (
            <Text style={styles.description}>{content}</Text>
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
                router.push(`/guide/product/${id}/edit-itineraries`)
              }
            >
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
          </View>
          {itineraries.map((item) => (
            <View key={item.clientId} style={styles.itineraryItem}>
              <View style={styles.itineraryTime}>
                <Text style={styles.itineraryTimeText}>Day {item.day}</Text>
                <Text style={styles.itineraryTimeText}>{item.startTime}</Text>
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
         * 여행자 쪽에서 보는 양식을 참고하기 위해 추가해 둔 것으로, 이후 삭제해야 합니다.
         */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='share-outline' size={20} color='#000' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='heart-outline' size={20} color='#000' />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomActionContainer}>
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

        <TouchableOpacity style={[styles.ctaButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>
            이 템플릿으로 모집 시작하기
          </Text>
        </TouchableOpacity>
      </View>
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
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#D9D9D9',
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
    color: '#000',
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
    paddingBottom: 20,
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
