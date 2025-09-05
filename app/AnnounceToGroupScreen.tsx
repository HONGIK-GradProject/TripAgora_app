import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnnounceToGroupScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일행에게 공지하기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="내용 입력..."
            multiline
          />
        </View>

        <TouchableOpacity style={styles.imageUploadButton}>
          <Ionicons name="image-outline" size={24} color="#999" />
          <Text style={styles.imageUploadButtonText}>사진 첨부하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.sendButton}>
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
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // 하단 액션 버튼 공간 확보
  },
  inputGroup: {
    marginBottom: 20,
    marginTop: 20,
  },
  textInput: {
    width: '100%',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
  },
  textArea: {
    height: 276,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  imageUploadButtonText: {
    fontSize: 20,
    color: '#999',
    marginLeft: 10,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  sendButton: {
    backgroundColor: '#8130FF',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AnnounceToGroupScreen;
