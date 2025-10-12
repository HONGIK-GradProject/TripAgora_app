import GuideProductList from '@/components/guide/product/GuideTemplateList';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useTemplateList } from '@/hooks/templates/useTemplateList';
import { createBlankTemplate } from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 가이드가 생성한 자신의 상품 템플릿 목록을 보여주는 화면 컴포넌트입니다.
 * 템플릿 목록을 조회, 검색하고 새로 생성하는 기능을 제공합니다.
 */
const MyProductsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { products, isLoading, error, loadMore, refetch } = useTemplateList();
  const { bottom } = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  /**
   * 새로운 빈 템플릿을 생성하고, 생성된 템플릿의 상세 편집 화면으로 이동합니다.
   */
  const handleCreateTemplate = async () => {
    try {
      const newTemplateId = await createBlankTemplate();
      router.push(`/guide/template/${newTemplateId}`);
      console.log(newTemplateId);
    } catch (error) {
      console.log('템플릿 생성 실패: ', error);
    }
  };

  /**
   * 리스트의 끝에 도달하여 추가 데이터를 로딩할 때 표시될 푸터 컴포넌트를 렌더링합니다.
   */
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
          placeholder='템플릿명으로 검색하기 (미구현)'
          placeholderTextColor={'#9CA3AF'}
        />
      </View>

      {/* 초기 로딩 처리 */}
      {isLoading && products.length === 0 ? (
        <FullScreenLoader />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          오류가 발생했습니다.
        </Text>
      ) : (
        <View className='px-5'>
          <Text className='text-3xl font-bold mb-5'>내 상품 템플릿</Text>
          <View
            className='bg-gray-50 rounded-2xl p-4'
            style={{ marginBottom: 16 + bottom }}
          >
            <GuideProductList
              products={products}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              onRefresh={refetch}
              refreshing={isLoading}
              contentContainerStyle={{ paddingBottom: 108 + bottom }}
            />
          </View>
        </View>
      )}

      {/* Floating action button - bottom right above bottom navbar */}
      <TouchableOpacity
        className='absolute right-6 w-16 h-16 rounded-full bg-white items-center justify-center'
        style={{
          elevation: 8,
          bottom: insets.bottom + 20,
        }}
        onPress={handleCreateTemplate}
      >
        <View style={{ marginLeft: -6, marginTop: -6 }}>
          <Ionicons name='add-circle' size={68} color={'#613eea'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyProductsScreen;
