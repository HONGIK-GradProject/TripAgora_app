import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  RefreshControlProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

interface ProductListProps {
  products: Product[];
  onEndReached?: () => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListFooterComponent?: React.ReactElement | null;
}

const TravelerProductList: React.FC<ProductListProps> = ({
  products,
  onEndReached,
  refreshControl,
  ListFooterComponent,
}) => {
  const renderItem = ({ item }: { item: Product }) => (
    <Link
      href={{
        pathname: '/traveler/explore/[id]',
        params: {
          id: item.id,
        },
      }}
      asChild
    >
      <TouchableOpacity className='bg-white rounded-2xl mb-2 p-5 shadow-sm border border-gray-100'>
        <View className='flex-row items-center'>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
            contentFit='cover'
          />
          <View className='flex-1'>
            <Text className='text-lg font-semibold text-gray-900 mb-1'>
              {item.title}
            </Text>
            <Text className='text-gray-600 mb-2'>{item.date}</Text>
            <View className='flex-row items-start'>
              <MaterialIcons
                name='person-outline'
                size={16}
                color='#6B7280'
                style={{ marginTop: 2 }}
              />
              <Text className='text-gray-600 ml-1 mr-4'>
                {item.participants}
              </Text>
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
                {item.location}
              </Text>
            </View>
            <View className='flex-row items-center mt-1'>
              <Text className='text-gray-500 text-sm mr-2'>{item.guide}</Text>
              {item.rating !== '-' && (
                <View className='flex-row items-center'>
                  <Ionicons name='star' size={14} color='#FBBF24' />
                  <Text className='text-gray-600 text-sm ml-1'>
                    {item.rating}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity className='p-2'>
            <Ionicons name='heart-outline' size={24} color='#999' />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      refreshControl={refreshControl}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export default TravelerProductList;
