import ProductList from '@/components/common/ProductList';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TemplateInfo } from '@/types/templates';
import { UserRole } from '@/types/users';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { FlatListProps, Text, View } from 'react-native';

interface TemplateListProps
  extends Omit<
    FlatListProps<TemplateInfo>,
    'data' | 'renderItem' | 'keyExtractor'
  > {
  templates: TemplateInfo[];
  userRole: UserRole;
}

const TemplateListElement = (item: TemplateInfo) => (
  <>
    <Image
      source={{ uri: item.firstImageUrl }}
      style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
      }}
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
  </>
);

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  userRole,
  ...rest
}) => {
  return (
    <ProductList<TemplateInfo>
      data={templates}
      keyExtractor={(item) => item.templateId.toString()}
      getHref={(item) => {
        if (userRole === 'GUIDE') {
          return {
            pathname: '/guide/template/[id]',
            params: { id: item.templateId },
          };
        } else {
          return {
            pathname: '/traveler/explore/[id]',
            params: { id: item.templateId },
          };
        }
      }}
      renderItemContent={TemplateListElement}
      {...rest}
    />
  );
};

export default TemplateList;
