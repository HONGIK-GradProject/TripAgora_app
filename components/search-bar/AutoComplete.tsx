import useDebounce from '@/hooks/useDebounce';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  LayoutRectangle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { SearchBarRenderProps } from './SearchBar';

/**
 * @interface AutoCompleteProps
 * @description AutoComplete 컴포넌트의 props를 정의합니다.
 */
interface AutoCompleteProps {
  /** 부모로부터 제어되는 현재 검색어 */
  query: string;
  /** 검색어 변경 시 부모에게 알리는 콜백 함수 */
  onQueryChange: (query: string) => void;
  /** 디바운싱된 검색어를 기반으로 추천 목록을 비동기적으로 가져오는 함수 */
  fetchSuggestions: (query: string) => Promise<AutoCompleteElement[]>;
  /** 추천 항목 선택 또는 검색 실행 시 최종 검색어를 부모에게 알리는 콜백 함수 */
  onSearch: (query: string) => void;
  /** 검색창 UI를 렌더링하기 위한 Render Prop 함수 */
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

/**
 * 자동완성 검색 기능의 로직을 담당하는 "Headless" 컴포넌트입니다.
 * 이 컴포넌트는 UI를 직접 렌더링하지 않고, `children`으로 받은 Render Prop 함수를 통해
 * UI 렌더링을 위임합니다. (제어되는 컴포넌트로 동작)
 *
 * @remarks
 * - `useDebounce` 훅을 사용하여 검색어 입력 시 API 호출을 최적화합니다.
 * - `fetchSuggestions` prop을 통해 추천 목록을 비동기적으로 가져옵니다.
 * - 부모로부터 `query`와 `onQueryChange`를 받아 제어되는 컴포넌트로 동작합니다.
 * - 계산된 상태와 핸들러 함수들을 `children` 함수에 인자로 전달합니다.
 */
const AutoComplete: React.FC<AutoCompleteProps> = ({
  query,
  onQueryChange,
  fetchSuggestions,
  onSearch,
  children,
}) => {
  const [suggestions, setSuggestions] = useState<AutoCompleteElement[]>([]);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const componentRef = useRef<View>(null);

  // query가 변경될 때마다 300ms 지연된 값을 debouncedQuery에 저장
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
    onQueryChange(suggestion);
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
      {children({ query, setQuery: onQueryChange, onSearch: handleSearch })}

      {showSuggestions &&
        layout && (
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
              keyExtractor={(item, index) => `${item.title}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item.title)}
                >
                  <Text style={styles.suggestionTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.suggestionDescription}>
                      {item.description}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
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
