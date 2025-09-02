import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditGuideProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가이드 프로필 편집</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person-circle-outline" size={96} color="#999" />
          <Text style={styles.profileName}>김 홍익</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>자기소개</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="함께 즐거운 여행해요!" // 기존 데이터
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>태그</Text>
          <View style={styles.tagContainer}>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 후쿠오카</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 홍대</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 음식</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 액티비티</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TextInput
              style={[styles.textInput, styles.tagInput]}
              placeholder="# 태그 추가"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>변경 내용 저장하기</Text>
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
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
  },
  textArea: {
    height: 177,
    textAlignVertical: 'top',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  existingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8130FF',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  existingTagText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 5,
  },
  closeIcon: {
    marginLeft: 5,
  },
  tagInput: {
    flex: 1,
    minWidth: 120,
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
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
  saveButton: {
    backgroundColor: '#8130FF',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EditGuideProfileScreen;
