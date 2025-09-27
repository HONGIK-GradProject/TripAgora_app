import { TemplateInfo } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

type ProductInfo = TemplateInfo;

interface ProductListProps {
  products: ProductInfo[];
}

const GuideProductList: React.FC<ProductListProps> = ({ products }) => {
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
        <Image
          source={{ uri: item.firstImageUrl }}
          className='w-24 h-24 rounded-xl mr-4'
        />
        <View className='flex-1'>
          <Text className='text-2xl font-bold mb-1'>
            { item.title }
          </Text>
          <Text className='text-lg text-gray-600'>
            { item.regionNames.reduce(region => `${region} `) }
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
    />
  );
};

export default GuideProductList;