
import useDebounce from '@/hooks/useDebounce'; // useDebounce 훅 가져오기
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, LayoutRectangle, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { SearchBarRenderProps } from './SearchBar';

interface AutoCompleteProps {
  fetchSuggestions: (query: string) => Promise<AutoCompleteElement[]>;
  onSearch: (query: string) => void;
  children: (props: SearchBarRenderProps) => React.ReactNode;
}

/**
 * @interface AutoCompleteElement
 * @description 자동완성 추천 목록에 표시될 개별 항목의 데이터 구조를 정의합니다.
 */
export interface AutoCompleteElement {
  /**
   * 추천 항목의 주 텍스트(제목)입니다.
   * 목록에 표시되며, 선택 시 검색창의 값이 됩니다.
   * @example "서울역"
   */
  title: string;
  /**
   * 추천 항목에 대한 추가적인 설명 텍스트입니다. (선택 사항)
   * 주소, 카테고리 등 부가 정보를 표시하는 데 사용될 수 있습니다.
   * @example "서울 용산구 한강대로 405"
   */
  description?: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ fetchSuggestions, onSearch, children }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutoCompleteElement[]>([]);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const componentRef = useRef<View>(null);

  // query가 변경될 때마다 500ms 지연된 값을 debouncedQuery에 저장
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // 지연 처리된 debouncedQuery를 사용하여 API를 호출합니다.
    const loadSuggestions = async () => {
      if (debouncedQuery.trim().length > 0) {
        const fetchedSuggestions = await fetchSuggestions(debouncedQuery);
        setSuggestions(fetchedSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    loadSuggestions();
  }, [debouncedQuery, fetchSuggestions]); // debouncedQuery가 변경될 때만 실행

  const handleSearch = () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setSuggestions([]);
    onSearch(query);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    Keyboard.dismiss();
    onSearch(suggestion);
  };

  const showSuggestions = query.length > 0 && suggestions.length > 0;

  const handleLayout = () => {
    componentRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height });
    });
  };

  return (
    <View ref={componentRef} onLayout={handleLayout}>
      {children({ query, setQuery, onSearch: handleSearch })}

      {showSuggestions && layout && (
        <Modal
          visible={showSuggestions}
          transparent
          animationType="none"
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSuggestions([])} />
          <View
            style={[
              styles.suggestionsContainer,
              {
                top: layout.y + layout.height + 6, // SearchBar 하단에 약간의 간격을 두고 위치
                left: layout.x + 16, // SearchBar의 좌측 여백(16) 고려
                width: layout.width - 32, // SearchBar의 좌우 여백(16*2) 고려
              },
            ]}
          >
            <FlatList
              style={{ flex: 1 }}
              data={suggestions}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item.title)}
                >
                  <Text style={styles.suggestionTitle}>{item.title}</Text>
                  {item.description && 
                    <Text style={styles.suggestionDescription}>{item.description}</Text>
                  }
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  suggestionsContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionTitle: {
    fontSize: 16,
    color: '#374151',
  },
  suggestionDescription: {
    fontSize: 12,
    color: '#8b929c',
  },
});

export default AutoComplete;
