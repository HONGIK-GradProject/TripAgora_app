import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const EditProductScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상품 수정하기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageUploadSection}>
          <Image source={{ uri: 'https://via.placeholder.com/428x292' }} style={styles.mainImage} />
          <TouchableOpacity style={styles.imageUploadButton}>
            <Ionicons name="camera" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>제목을 입력하세요</Text>
          <TextInput
            style={styles.textInput}
            placeholder="후쿠오카 놀러가실분" // 기존 데이터
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>모집 인원 (본인 제외)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="3" // 기존 데이터
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>여행 소개</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="후쿠오카에서 4박 5일간 함께 여행하실 분을 모집합니다! 가까워서 금방 다녀오기에도 좋아요! 하카타의 캐널 시티와 그 주변에서 주로 활동할 것 같습니다." // 기존 데이터
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>태그</Text>
          <View style={styles.tagContainer}>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 쇼핑</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 음식</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 일본</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 후쿠오카</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 하카타</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.existingTag}>
              <Text style={styles.existingTagText}># 해외여행</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.closeIcon} />
            </TouchableOpacity>
            <TextInput
              style={[styles.textInput, styles.tagInput]}
              placeholder="# 태그 추가"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.datePickerButton}>
          <MaterialCommunityIcons name="calendar-month" size={24} color="#8130FF" />
          <Text style={styles.datePickerButtonText}>일정 설정하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={24} color="#8130FF" />
          <Text style={styles.locationButtonText}>위치 설정하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>수정하기</Text>
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
  imageUploadSection: {
    width: '100%',
    height: 292,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  imageUploadButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
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
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
  },
  textArea: {
    height: 150,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    marginBottom: 15,
  },
  datePickerButtonText: {
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    marginBottom: 20,
  },
  locationButtonText: {
    fontSize: 20,
    color: '#8130FF',
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
  editButton: {
    backgroundColor: '#8130FF',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EditProductScreen;
