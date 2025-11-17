import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleClear = () => {
    setQuery('');
    // 검색어를 지울 때는 검색을 트리거하지 않음
    // (템플릿 검색의 경우 useEffect에서 처리하고, 지도 검색의 경우 빈 쿼리 검색을 방지)
  };

  const handleSearchPress = () => {
    onSearch();
    inputRef.current?.blur();
  };

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <TouchableOpacity
        onPress={handleSearchPress}
        style={styles.searchIconButton}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather
          name='search'
          size={20}
          color={isFocused ? '#8130FF' : '#6B7280'}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor='#9CA3AF'
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType='search'
        autoCapitalize='none'
        autoCorrect={false}
        clearButtonMode='never'
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name='x-circle' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerFocused: {
    borderColor: '#8130FF',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconButton: {
    marginRight: 8,
    padding: 4,
  },
  icon: {
    // 아이콘 자체는 버튼 내부에 있어서 margin 없음
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchBar;
