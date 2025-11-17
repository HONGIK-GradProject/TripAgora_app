import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import SessionRoomContent from '@/components/session/SessionRoomContent';
import { SessionDetailsProvider } from '@/contexts/SessionDetailsProvider';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
        <SessionRoomContent userType='traveler' />
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
