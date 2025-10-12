import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * @interface SearchBarRenderProps
 * @description `AutoComplete` 로직 컴포넌트가 `SearchBar` UI 컴포넌트에 전달하는 props입니다.
 */
export interface SearchBarRenderProps {
  /** 현재 검색어 문자열 */
  query: string;
  /** 검색어 문자열을 업데이트하는 함수 */
  setQuery: (query: string) => void;
  /** 검색 실행 함수 */
  onSearch: () => void;
}

interface SearchBarProps extends SearchBarRenderProps {
  /** 입력 필드에 표시될 플레이스홀더 텍스트 */
  placeholder?: string;
}

/**
 * 검색창의 UI를 담당하는 순수한 프레젠테이션 컴포넌트입니다.
 * 상태나 로직을 직접 갖지 않으며, 모든 데이터와 핸들러는 props를 통해 전달받습니다.
 * @param {SearchBarProps} props - 컴포넌트에 전달되는 props입니다.
 * @returns {React.ReactElement} 검색창 UI 엘리먼트입니다.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  placeholder = '검색어를 입력하세요...',
}) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => setQuery('')}
          style={styles.clearButton}
        >
          <Feather name="x-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchBar;
