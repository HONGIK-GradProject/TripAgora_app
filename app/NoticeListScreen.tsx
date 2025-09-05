import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NoticeListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가이드의 공지사항</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.noticeItem}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.noticeImage} />
          <Text style={styles.noticeText}>오후 6시 반에 숙소에서 저녁 준비 시작할 테니 늦지 않게 와주세요!!</Text>
        </View>
        <View style={styles.noticeItem}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.noticeImage} />
          <Text style={styles.noticeText}>첫 일정은 즐거우셨나요? 이제 저녁 시간까지 자유 행동 하겠습니...</Text>
        </View>
        <View style={styles.noticeItem}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.noticeImage} />
          <Text style={styles.noticeText}>즐거운 여행 되시기 위해 노력하겠습니다. 잘 부탁드립니다!</Text>
        </View>
        <View style={styles.noticeItem}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.noticeImage} />
          <Text style={styles.noticeText}>공지 테스트</Text>
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
    paddingBottom: 20,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  noticeImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  noticeText: {
    flex: 1,
    fontSize: 20,
    color: '#000',
  },
});

export default NoticeListScreen;
