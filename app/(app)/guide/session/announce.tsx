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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 세션 공지하기 화면입니다.
 */
const AnnounceScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일행에게 공지하기</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 내용 입력 영역 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder='현재 임시 화면 적용중이며, 추후 해당 announce.tsx 파일을 [id] 폴더 내부로 이동시킨 뒤
            session-room.tsx 파일에서 라우팅에 id 정보를 추가해야 합니다.'
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical='top'
            placeholderTextColor='#999999'
          />
        </View>
      </ScrollView>

      {/* 하단 발송 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendAnnouncement}
        >
          <Text style={styles.sendButtonText}>공지 발송하기</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 29,
    paddingTop: 20,
  },
  inputContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: '#fff',
    minHeight: 276,
    padding: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    textAlignVertical: 'top',
    minHeight: 200,
  },
  bottomContainer: {
    paddingHorizontal: 19,
    paddingBottom: 27,
    paddingTop: 27,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sendButton: {
    backgroundColor: '#8130FF',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default AnnounceScreen;
