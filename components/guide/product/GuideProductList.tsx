import { TemplateInfo } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, FlatListProps } from 'react-native';

type ProductInfo = TemplateInfo;

// ProductListProps가 FlatList의 모든 속성을 받도록 확장합니다.
// 단, data와 renderItem은 내부적으로 처리하므로 Omit으로 제외합니다.
interface ProductListProps extends Omit<FlatListProps<ProductInfo>, 'data' | 'renderItem'> {
  products: ProductInfo[];
}

const GuideProductList: React.FC<ProductListProps> = ({ products, ...rest }) => {
  const renderItem = ({ item }: { item: ProductInfo }) => (
    <Link href={{
      pathname: "/guide/product/[id]",
      params: {
        id: item.templateId
      }
    }} asChild>
      <TouchableOpacity
        className='flex-row bg-white border border-gray-200 rounded-3xl p-4 mb-4 items-center shadow-sm'
      >
        <Text>
          {item.templateId}
        </Text>
        <Image
          source={{ uri: item.firstImageUrl }}
          className='w-24 h-24 rounded-xl mr-4'
        />
        <View className='flex-1'>
          <Text className='text-2xl font-bold mb-1'>
            { item.title }
          </Text>
          <Text className='text-lg text-gray-600'>
            {/* regionNames 배열을 공백으로 구분된 문자열로 변환합니다. */}
            { item.regionNames.join(' ') }
          </Text>
        </View>
        <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={ item => item.templateId.toString() }
      showsVerticalScrollIndicator={false}
      {...rest} // onEndReached와 같은 나머지 속성들을 FlatList에 전달합니다.
    />
  );
};

export default GuideProductList;
