import GuideProductList from '@/components/guide/product/GuideProductList';
import { useTemplateList } from '@/hooks/templates/useTemplateList';
import { createBlankTemplate } from '@/services/templates';
import { TemplateInfo } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const sampleProducts : TemplateInfo[] = [
  {
    templateId: 1,
    title: '홍대 1박2일 모임',
    firstImageUrl: '',
    regionNames: ['홍대']
  },
  {
    templateId: 2,
    title: '후쿠오카 놀러가실분',
    firstImageUrl: '',
    regionNames: ['일본', '후쿠오카']
  },
  {
    templateId: 18,
    title: "템플릿 제목입니다 18",
    firstImageUrl: "https://example.com/images/busan1.jpg",
    regionNames: [
      "세종",
      "전남",
      "강남구"
    ]
  },
  {
    templateId: 17,
    title: "템플릿 제목입니다 17",
    firstImageUrl: "https://example.com/images/busan1.jpg",
    regionNames: [
      "세종",
      "전남",
      "강남구"
    ]
  },
  {
    templateId: 16,
    title: "템플릿 제목입니다 16",
    firstImageUrl: "https://example.com/images/busan1.jpg",
    regionNames: [
      "세종",
      "전남",
      "강남구"
    ]
  },
  {
    templateId: 15,
    title: "템플릿 제목입니다 15",
    firstImageUrl: "https://example.com/images/busan1.jpg",
    regionNames: [
      "강북구",
      "남동구",
      "횡성군"
    ]
  },
]
const MyProductsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { products, isLoading, error, hasNextPage, loadMore } = useTemplateList();

  const handleCreateTemplate = async () => {
    try {
      const newTemplateId = await createBlankTemplate();
      router.push(`/guide/product/${newTemplateId}`);
      console.log(newTemplateId);
    } catch (error) {
      console.log('템플릿 생성 실패: ', error);
    }
  }
  
  const renderFooter = () => {
    // 추가 페이지 로딩 시에만 하단 로딩 아이콘 표시
    if (isLoading && products.length > 0) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }
    return null;
  };
  
  return (
    <View className='flex-1 bg-white pt-12 relative'>
      <View className='flex-row items-center mx-5 mb-5 rounded-full bg-gray-100 px-4 py-3'>
        <Ionicons name='search' size={20} color='#999' />
        <TextInput
          className='flex-1 text-base text-gray-700 ml-2'
          placeholder='내 여행 모집 검색하기'
          placeholderTextColor={'#9CA3AF'}
        />
      </View>

      {/* 초기 로딩 처리 */}
      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>오류가 발생했습니다.</Text>
      ) : (
        <View
          className='px-5 pb-24'
        >
          <Text className='text-3xl font-bold mb-5'>내 상품 템플릿</Text>
          <GuideProductList
            products={products}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}

      {/* Floating action button - bottom right above bottom navbar */}
      <TouchableOpacity
        className='absolute right-5 w-16 h-16 rounded-full bg-[#613EEA] items-center justify-center'
        style={{ elevation: 8, bottom: insets.bottom + 20 }}
        onPress={handleCreateTemplate}
      >
        <Ionicons name='add' size={32} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

export default MyProductsScreen;
