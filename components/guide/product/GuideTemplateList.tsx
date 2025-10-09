import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TemplateInfo } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ProductListProps가 FlatList의 모든 속성을 받도록 확장합니다.
// 단, data와 renderItem은 내부적으로 처리하므로 Omit으로 제외합니다.
interface TemplateListProps
  extends Omit<FlatListProps<TemplateInfo>, 'data' | 'renderItem'> {
  products: TemplateInfo[];
}

const GuideTemplateList: React.FC<TemplateListProps> = ({
  products,
  ...rest
}) => {
  const renderItem = ({ item }: { item: TemplateInfo }) => (
    <Link
      href={{
        pathname: '/guide/template/[id]',
        params: {
          id: item.templateId,
        },
      }}
      asChild
    >
      <TouchableOpacity className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-2'>
        <View className='flex-row items-center'>
          <Image
            source={{ uri: item.firstImageUrl }}
            className='w-20 h-20 rounded-xl mr-4'
          />
          <View className='flex-1'>
            <Text className='text-lg font-semibold text-gray-900 mb-1'>
              {item.title}
            </Text>
            <View className='flex-row items-center'>
              <Ionicons name='location-outline' size={16} color='#6B7280' />
              <Text className='text-gray-600 ml-1'>
                {item.regionIds
                  .map((id) => REGION_ID_TO_NAME_MAP[id])
                  .join(', ')}
              </Text>
            </View>
          </View>
          <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.templateId.toString()}
      showsVerticalScrollIndicator={false}
      {...rest} // onEndReached와 같은 나머지 속성들을 FlatList에 전달합니다.
    />
  );
};

export default GuideTemplateList;
