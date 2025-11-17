import ProductList from '@/components/common/ProductList';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { FlatListProps, RefreshControlProps, Text, View } from 'react-native';

export interface Product {
  id: string;
  title: string;
  date: string;
  participants: string;
  location: string;
  guide: string;
  rating: string | '-';
  imageUrl: string;
}

/**
 * @interface SessionListProps
 * @extends Omit<FlatListProps<SessionInfo>, 'data' | 'renderItem' | 'keyExtractor'> `FlatList`의 props를 상속받지만, 내부적으로 처리되는 props는 제외합니다.
 *
 * SessionList 컴포넌트에 전달되는 props입니다.
 */
interface ProductListProps
  extends Omit<FlatListProps<Product>, 'data' | 'renderItem' | 'keyExtractor'> {
  /**
   * 리스트에 표시될 세션 데이터 배열입니다.
   */
  products: Product[];
}

interface TravelerProductListProps {
  products: Product[];
  onEndReached?: () => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListEmptyComponent?: React.ReactElement | React.ComponentType<any> | null;
  ListFooterComponent?: React.ReactElement | React.ComponentType<any> | null;
  detailPath?: string; // 세션 상세 페이지 경로 (기본값: '/traveler/explore/[id]')
  contentContainerStyle?: any;
}

const renderTravelerProductItemContent = (item: Product) => {
  const title = item.title?.trim() || '제목 없음';
  const location = item.location?.trim() || '지역 정보 없음';

  return (
    <>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
        contentFit='cover'
      />
      <View className='flex-1'>
        <Text className='text-lg font-semibold text-gray-900 mb-1'>
          {title}
        </Text>
        <Text className='text-gray-600 mb-2'>{item.date}</Text>
        <View className='flex-row items-start'>
          <MaterialIcons
            name='person-outline'
            size={16}
            color='#6B7280'
            style={{ marginTop: 2 }}
          />
          <Text className='text-gray-600 ml-1 mr-4'>{item.participants}</Text>
          <Ionicons
            name='location-outline'
            size={16}
            color='#6B7280'
            style={{ marginTop: 2 }}
          />
          <Text
            className='text-gray-600 ml-1 mr-4'
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {location}
          </Text>
        </View>
        {item.rating !== '-' && (
          <View className='flex-row items-center mt-1'>
            <Ionicons name='star' size={14} color='#FBBF24' />
            <Text className='text-gray-600 text-sm ml-1'>{item.rating}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const TravelerProductList: React.FC<TravelerProductListProps> = ({
  products,
  detailPath = '/traveler/explore/[id]',
  ...rest
}) => {
  const getTravelerProductHref = (item: Product) => ({
    pathname: detailPath as any,
    params: {
      id: item.id,
    },
  });

  return (
    <ProductList<Product>
      data={products}
      renderItemContent={renderTravelerProductItemContent}
      getHref={getTravelerProductHref}
      keyExtractor={(item) => item.id}
      {...rest}
    />
  );
};

export default TravelerProductList;
