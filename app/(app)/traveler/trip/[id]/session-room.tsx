import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import SessionRoomContent from '@/components/session/SessionRoomContent';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useSessionDetails } from '@/hooks/sessions/useSessionDetails';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SessionRoomContentWrapper: React.FC<{ userType: 'guide' | 'traveler' }> = ({
  userType,
}) => {
  const { refetch } = useSessionDetails();

  // 화면이 포커스될 때마다 일정 데이터를 다시 불러옵니다
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return <SessionRoomContent userType={userType} />;
};

const TravelerSessionRoomScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>세션 ID가 없습니다.</Text>
      </View>
    );
  }

  return (
    <CustomSafeAreaView>
      <SessionDetailsProvider id={id}>
        <SessionRoomContentWrapper userType='traveler' />
      </SessionDetailsProvider>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default TravelerSessionRoomScreen;
