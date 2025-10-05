import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface FullScreenLoaderProps {
  size?: 'large' | 'small';
  color?: string;
}

/**
 * 화면 전체를 덮는 로딩 인디케이터를 표시하는 재사용 가능한 컴포넌트입니다.
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  size = 'large',
  color = '#8130FF',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default FullScreenLoader;
