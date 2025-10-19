import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * 세션 공지하기 화면입니다.
 */
const AnnounceScreen: React.FC = () => {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSendAnnouncement = () => {
    if (!content.trim()) {
      Alert.alert('알림', '공지 내용을 입력해주세요.');
      return;
    }

    Alert.alert('공지 발송', '공지를 발송하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '발송',
        onPress: () => {
          console.log('공지 발송:', { content });
          Alert.alert('완료', '공지가 발송되었습니다.', [
            {
              text: '확인',
              onPress: () => router.back(),
            },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 섹션 */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>일행에게 공지하기</Text>
          </View>
        </View>

        {/* 내용 입력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>공지 내용</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder='일행들에게 전달할 내용을 입력해주세요'
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical='top'
              placeholderTextColor='#9CA3AF'
            />
          </View>
          <Text style={styles.charCount}>{content.length}/500</Text>
        </View>

        {/* 미리보기 섹션 */}
        {content.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>미리보기</Text>
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Ionicons name='notifications' size={20} color='#FF8330' />
                <Text style={styles.previewLabel}>공지</Text>
              </View>
              <Text style={styles.previewContent}>{content}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 하단 액션 */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, styles.primaryButton]}
          onPress={handleSendAnnouncement}
        >
          <Text style={styles.primaryButtonText}>공지 발송하기</Text>
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    minHeight: 200,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
    minHeight: 150,
    lineHeight: 24,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  previewContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8330',
    marginLeft: 6,
  },
  previewContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#8130FF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnnounceScreen;
