import ProductList from '@/components/common/ProductList';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TemplateInfo } from '@/types/templates';
import { UserRole } from '@/types/users';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { FlatListProps, Text, View } from 'react-native';

/**
 * @interface TemplateListProps
 * @extends Omit<FlatListProps<TemplateInfo>, 'data' | 'renderItem' | 'keyExtractor'> `FlatList`의 props를 상속받지만, 내부적으로 처리되는 props는 제외합니다.
 *
 * TemplateList 컴포넌트에 전달되는 props입니다.
 */
interface TemplateListProps
  extends Omit<
    FlatListProps<TemplateInfo>,
    'data' | 'renderItem' | 'keyExtractor'
  > {
  /**
   * 리스트에 표시될 템플릿 데이터 배열입니다.
   */
  templates: TemplateInfo[];
  /**
   * 현재 사용자의 역할('GUIDE' 또는 'TRAVELER')입니다.
   * 이 역할에 따라 아이템 클릭 시 이동하는 경로가 달라집니다.
   */
  userRole: UserRole;
}

/**
 * 개별 템플릿 아이템의 UI를 렌더링하는 컴포넌트입니다.
 * @param {TemplateInfo} item - 렌더링할 템플릿 정보.
 * @returns {React.ReactElement} - 템플릿 아이템의 JSX 엘리먼트.
 */
const TemplateListElement = (item: TemplateInfo) => {
  const title = item.title?.trim() || '제목 없음';
  const regionText =
    item.regionIds && item.regionIds.length > 0
      ? item.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id]).join(', ')
      : '지역 정보 없음';

  return (
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
          {title}
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
            {regionText}
          </Text>
        </View>
      </View>
      <Ionicons name='chevron-forward' size={20} color={'#9CA3AF'} />
    </>
  );
};

/**
 *
 *
 * @param {TemplateListProps} props - 컴포넌트에 전달되는 props.
 * @returns {React.ReactElement} - 렌더링된 템플릿 리스트 컴포넌트.
 */
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
        return {
          pathname: '/guide/template/[id]',
          params: { id: item.templateId },
        };
      }}
      renderItemContent={TemplateListElement}
      {...rest}
    />
  );
};

export default TemplateList;
