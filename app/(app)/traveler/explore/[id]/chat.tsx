import ChatRoom from '@/components/common/ChatRoom';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatContent: React.FC<{ roomId: number }> = ({ roomId }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title } = useSessionDetails();

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || '채팅방'}
        </Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // TODO: 채팅 메뉴 (멤버 목록 등) 구현
            console.log('메뉴 버튼 클릭');
          }}
        >
          <Ionicons name='ellipsis-vertical' size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* 채팅 룸 */}
      <View style={styles.chatContainer}>
        <ChatRoom roomId={roomId} />
      </View>
    </View>
  );
};

const TravelerChatScreen: React.FC = () => {
  const { id, roomId } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  if (!roomId || !id) {
    return <></>;
  }

  return (
    <CustomSafeAreaView>
      <SessionDetailsProvider id={id}>
        <ChatContent roomId={+roomId} />
      </SessionDetailsProvider>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
});

export default TravelerChatScreen;
