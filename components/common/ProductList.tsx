import { Link, RelativePathString } from 'expo-router';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProductListProps<T>
  extends Omit<FlatListProps<T>, 'data' | 'renderItem' | 'keyExtractor'> {
  data: T[];
  renderItemContent: (item: T) => React.ReactNode;
  getHref: (item: T) => string | object;
  keyExtractor: (item: T, index?: number) => string;
}

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
