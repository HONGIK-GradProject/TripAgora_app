import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>홍대 1박2일 모임</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.messageContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>박 대기 오후 15:30</Text>
            <Text style={styles.messageText}>안녕하세요</Text>
            <Text style={styles.messageText}>같이 옷 보러 가실 분 계신가요</Text>
          </View>
        </View>

        <View style={[styles.messageContainer, styles.myMessageContainer]}>
          <View style={[styles.messageBubble, styles.myMessageBubble]}>
            <Text style={styles.myMessageSender}>홍 길동 오후 15:31</Text>
            <Text style={styles.myMessageText}>저용</Text>
          </View>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
        </View>

        <View style={styles.messageContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>박 대기 오후 15:31</Text>
            <Text style={styles.messageText}>좋습니다 제가 갈게요</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.chatInput}
          placeholder="메시지 입력"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={30} color="#999" />
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
    justifyContent: 'space-between',
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
  menuButton: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 80, // 입력창 공간 확보
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#D9D9D9',
  },
  messageBubble: {
    backgroundColor: 'rgba(208, 208, 208, 0.66)',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
  },
  myMessageBubble: {
    backgroundColor: '#8130FF',
    marginLeft: 10,
  },
  messageSender: {
    fontSize: 20,
    color: '#000',
    marginBottom: 5,
  },
  myMessageSender: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 20,
    color: '#000',
  },
  myMessageText: {
    fontSize: 20,
    color: '#fff',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    height: 48,
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});

export default ChatScreen;
