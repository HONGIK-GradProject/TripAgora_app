import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatMenuScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>멤버 목록</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.memberItem}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <Text style={styles.memberName}>박 대기</Text>
        </View>
        <View style={styles.memberItem}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <Text style={styles.memberName}>김 홍익</Text>
        </View>
        <View style={styles.memberItem}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <Text style={styles.memberName}>홍 길동</Text>
        </View>

        <TouchableOpacity style={styles.noticeListButton}>
          <Ionicons name="document-text-outline" size={24} color="#8130FF" />
          <Text style={styles.noticeListButtonText}>공지 목록 확인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.oneToOneChatButton}>
          <Text style={styles.oneToOneChatButtonText}>가이드와 1:1 대화하기</Text>
        </TouchableOpacity>
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
    paddingVertical: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: '#D9D9D9',
  },
  memberName: {
    fontSize: 20,
    color: '#000',
  },
  noticeListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  noticeListButtonText: {
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 10,
  },
  oneToOneChatButton: {
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  oneToOneChatButtonText: {
    fontSize: 20,
    color: '#000',
  },
});

export default ChatMenuScreen;
