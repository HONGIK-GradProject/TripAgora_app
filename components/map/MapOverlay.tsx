import { fetchKakaoPlaceSearch } from '@/services/search';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AutoCompleteElement } from '../search-bar/AutoComplete';
import SearchWithAutoComplete from '../search-bar/SearchWithAutoComplete';
import { MapOverlayOptions } from './InteractiveMapView';

// --- Component Props ---

interface MapOverlayOptionProps {
  options?: MapOverlayOptions;
  onCenterToCurrentLocation?: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearch: (query: string) => void;
}

const fetchPlaceSuggestions = async (
  query: string
): Promise<AutoCompleteElement[]> => {
  try {
    const response = await fetchKakaoPlaceSearch(query);

    if (response && response.documents && response.documents.length > 0) {
      const places = response.documents.map(
        (doc: any) =>
          ({
            title: doc.place_name,
            description: doc.address_name,
          } as AutoCompleteElement)
      );

      return places;
    }

    return [];
  } catch (error) {
    console.error('장소 검색 중 에러 발생', error);
    return [];
  }
};

// --- Sub-components ---

const CurrentLocationButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.locationButton} onPress={onPress}>
    <Ionicons name="locate" size={24} color="#333" />
  </TouchableOpacity>
);

/**
 * MapOverlay is a component that displays UI elements on top of a map view.
 * It uses absolute positioning to place content.
 * Use SafeAreaView to avoid system UI like notches.
 */
export const MapOverlay = ({
  options,
  onCenterToCurrentLocation,
  searchQuery,
  onSearchChange,
  onSearch,
}: MapOverlayOptionProps) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        {/* Top-aligned elements */}
        <View style={styles.topContainer}>
          {options?.searchBar && (
            <SearchWithAutoComplete
              query={searchQuery}
              onQueryChange={onSearchChange}
              fetchSuggestions={fetchPlaceSuggestions}
              onSearch={onSearch}
              placeholder="장소 검색..."
            />
          )}
        </View>

        {/* Bottom-aligned elements */}
        <View style={styles.bottomContainer}>
          {options?.currentLocationButton && onCenterToCurrentLocation && (
            <CurrentLocationButton onPress={onCenterToCurrentLocation} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    // Container for search bar, filters, etc.
  },
  bottomContainer: {
    padding: 16,
    alignItems: 'flex-end', // Align items to the right
  },
  locationButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for depth
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});