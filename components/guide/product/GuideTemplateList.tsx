import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TemplateInfo } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ProductListProps가 FlatList의 모든 속성을 받도록 확장합니다.
// 단, data와 renderItem은 내부적으로 처리하므로 Omit으로 제외합니다.
interface TemplateListProps
  extends Omit<FlatListProps<TemplateInfo>, 'data' | 'renderItem'> {
  templates: TemplateInfo[];
}

const GuideTemplateList: React.FC<TemplateListProps> = ({
  templates,
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
            style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
            contentFit='cover'
          />
          <View className='flex-1'>
            <Text className='text-lg font-semibold text-gray-900 mb-1'>
              {item.title}
            </Text>
            <View className='flex-row items-start'>
              <Ionicons
                name='location-outline'
                size={16}
                color='#6B7280'
                style={{ marginTop: 2 }}
              />
              <Text
                className='text-gray-600 ml-1 flex-1'
                numberOfLines={2}
                ellipsizeMode='tail'
              >
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
      data={templates}
      renderItem={renderItem}
      keyExtractor={(item) => item.templateId.toString()}
      showsVerticalScrollIndicator={false}
      {...rest} // onEndReached와 같은 나머지 속성들을 FlatList에 전달합니다.
    />
  );
};

export default GuideTemplateList;
