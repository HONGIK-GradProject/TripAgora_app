import { Link, RelativePathString } from 'expo-router';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * @interface ProductListProps
 * @template T 리스트에 표시될 데이터의 타입을 지정합니다.
 * @extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> `FlatList`의 props를 상속받지만, 내부적으로 처리되는 props는 제외합니다.
 *
 * 상세 페이지로 연결되는 아이템 목록을 표시하기 위한 범용 리스트 컴포넌트의 props입니다.
 */
interface ProductListProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> {
  /**
   * 리스트에 표시될 데이터 배열입니다.
   */
  data: T[];
  /**
   * 각 리스트 아이템의 내부 컨텐츠를 렌더링하는 함수입니다.
   * @param item 렌더링할 아이템 데이터입니다.
   * @returns 화면에 표시될 React 엘리먼트입니다.
   */
  renderItemContent: (item: T) => React.ReactNode;
  /**
   * 아이템을 눌렀을 때 이동할 경로(href)를 반환하는 함수입니다.
   * @param item 아이템 데이터입니다.
   * @returns `Link` 컴포넌트에 전달될 경로(문자열 또는 라우트 객체)입니다.
   */
  getHref: (item: T) => string | object;
  /**
   * 각 아이템의 고유 키를 추출하는 함수입니다.
   * @param item 아이템 데이터입니다.
   * @param index 아이템의 인덱스입니다.
   * @returns 아이템의 고유 키입니다.
   */
  keyExtractor: (item: T, index?: number) => string;
}

/**
 * 각 아이템이 상세 페이지로 연결되는 링크 역할을 하는 범용 리스트 컴포넌트입니다.
 * React Native의 `FlatList`를 기반으로 하며, 일관된 레이아웃과 네비게이션 구조를 제공합니다.
 *
 * @template T 리스트에 표시될 데이터 아이템의 타입입니다.
 * @param {ProductListProps<T>} props 컴포넌트에 전달될 props입니다.
 * @returns 렌더링된 `FlatList` 컴포넌트입니다.
 */
const ProductList = <T,>({
  data,
  renderItemContent,
  getHref,
  keyExtractor,
  ...rest
}: ProductListProps<T>) => {
  const renderItem = ({ item }: { item: T }) => (
    <Link href={getHref(item) as RelativePathString} asChild>
      <TouchableOpacity className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-2'>
        <View className='flex-row items-center'>{renderItemContent(item)}</View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
};

export default ProductList;
