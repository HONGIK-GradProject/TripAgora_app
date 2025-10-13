import React from 'react';
import AutoComplete, { AutoCompleteElement } from './AutoComplete';
import SearchBar from './SearchBar';

/**
 * @interface SearchWithAutoCompleteProps
 * @description SearchWithAutoComplete 컴포넌트의 props를 정의합니다.
 */
interface SearchWithAutoCompleteProps {
  query: string;
  onQueryChange: (query: string) => void;
  /**
   * 사용자가 입력한 검색어(query)를 기반으로 자동완성 추천 목록을 비동기적으로 가져오는 함수입니다.
   * @param query - 사용자가 입력한 현재 검색어 문자열입니다.
   * @returns 추천 검색어 객체 배열의 Promise를 반환해야 합니다.
   */
  fetchSuggestions: (query: string) => Promise<AutoCompleteElement[]>;

  /**
   * 검색이 최종적으로 실행될 때 호출되는 콜백 함수입니다.
   * (예: 검색 아이콘 클릭, 추천 항목 선택, 키보드의 '검색' 버튼 누름)
   * @param query - 최종 확정된 검색어 문자열입니다.
   */
  onSearch: (query: string) => void;

  /**
   * 검색창에 표시될 플레이스홀더 텍스트입니다.
   * @default "검색어를 입력하세요..."
   */
  placeholder?: string;
}

/**
 * 자동완성 기능이 결합된 검색창 UI를 제공하는 컨테이너 컴포넌트입니다.
 *
 * @remarks
 * 내부적으로 `AutoComplete` 로직 컴포넌트와 `SearchBar` UI 컴포넌트를 조합합니다.
 * 이를 통해 부모 컴포넌트에서는 복잡한 Render Prop 패턴 없이 간결하게 자동완성 검색창을 사용할 수 있습니다.
 *
 * @example
 * ```tsx
 * <SearchWithAutoComplete
 *   query={searchQuery}
 *   onQueryChange={setSearchQuery}
 *   fetchSuggestions={mySuggestionFetcher}
 *   onSearch={handleFinalSearch}
 *   placeholder="도시, 장소 등을 검색해보세요"
 * />
 * ```
 *
 * @param {SearchWithAutoCompleteProps} props - 컴포넌트에 전달되는 props입니다.
 * @returns {React.ReactElement} 자동완성 기능이 포함된 검색창 컴포넌트입니다.
 */
const SearchWithAutoComplete: React.FC<SearchWithAutoCompleteProps> = ({
  query,
  onQueryChange,
  fetchSuggestions,
  onSearch,
  placeholder,
}) => {
  return (
    <AutoComplete
      query={query}
      onQueryChange={onQueryChange}
      fetchSuggestions={fetchSuggestions}
      onSearch={onSearch}
    >
      {(props) => <SearchBar {...props} placeholder={placeholder} />}
    </AutoComplete>
  );
};

export default SearchWithAutoComplete;