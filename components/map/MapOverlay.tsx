import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';

/**
 * MapOverlay is a component that displays UI elements on top of a map view.
 * It uses absolute positioning to place content.
 * Use SafeAreaView to avoid system UI like notches.
 */
export const MapOverlay = () => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <ThemedText type="title">Map Overlay</ThemedText>
        </View>
        {/* Add other overlay elements here, e.g., buttons at the bottom */}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
