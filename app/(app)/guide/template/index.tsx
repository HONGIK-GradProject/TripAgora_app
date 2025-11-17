import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import GuideTemplateList from '@/components/guide/template/GuideTemplateList';
import SearchWithAutoComplete from '@/components/search-bar/SearchWithAutoComplete';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useTemplateList } from '@/hooks/templates/useTemplateList';
import { createBlankTemplate } from '@/services/templates';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 가이드가 생성한 자신의 상품 템플릿 목록을 보여주는 화면 컴포넌트입니다.
 * 템플릿 목록을 조회, 검색하고 새로 생성하는 기능을 제공합니다.
 */
const MyTemplatesScreen: React.FC = () => {
  const { templates, isLoading, error, loadMore, refetch } = useTemplateList();
  const { bottom } = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    if (!submittedQuery.trim()) {
      return templates;
    }
    const lowercasedQuery = submittedQuery.toLowerCase();
    return templates.filter((info) =>
      info.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [templates, submittedQuery]);

  // 자동완성 비활성화
  const handleFetchSuggestions = async (query: string) => {
    return [];
  };

  const handleSearch = (query: string) => {
    setSubmittedQuery(query);
  };

  // 검색어가 비워졌을 때 자동으로 전체 조회
  React.useEffect(() => {
    if (searchQuery.trim() === '' && submittedQuery.trim() !== '') {
      setSubmittedQuery('');
    }
  }, [searchQuery, submittedQuery]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      setSearchQuery('');
      setSubmittedQuery('');
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
      console.log('여행 계획 생성 실패: ', error);
    }
  };

  /**
   * 리스트의 끝에 도달하여 추가 데이터를 로딩할 때 표시될 푸터 컴포넌트를 렌더링합니다.
   */
  const renderFooter = () => {
    // 추가 페이지 로딩 시에만 하단 로딩 아이콘 표시
    if (isLoading && templates.length > 0) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  // Wrap loadMore and refetch to ensure no arguments are passed
  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <CustomSafeAreaView>
      <View className='flex-1 bg-gray-50 pt-6 relative'>
        {/* 초기 로딩 처리 */}
        {isLoading && templates.length === 0 ? (
          <FullScreenLoader />
        ) : error ? (
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            오류가 발생했습니다.
          </Text>
        ) : (
          <>
            <View className='px-6'>
              <Text className='text-3xl font-bold mb-2'>나의 여행 계획</Text>
            </View>
            <SearchWithAutoComplete
              query={searchQuery}
              onQueryChange={setSearchQuery}
              fetchSuggestions={handleFetchSuggestions}
              onSearch={handleSearch}
              placeholder='제목으로 여행 계획 찾기'
            />
            <View className='bg-gray-50 rounded-2xl px-6 py-4'>
              <GuideTemplateList
                templates={filteredTemplates}
                userRole='GUIDE'
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                  <View className='flex-1 items-center justify-center py-20'>
                    <Ionicons name='document-outline' size={48} color='#9CA3AF' />
                    <Text className='text-gray-500 text-lg mt-4'>
                      {submittedQuery.trim()
                        ? '검색 결과가 없습니다.'
                        : '등록된 여행 계획이 없습니다.'}
                    </Text>
                    {!submittedQuery.trim() && (
                      <Text className='text-gray-400 text-sm mt-2'>
                        우측 하단 버튼을 눌러 여행 계획을 만들어보세요!
                      </Text>
                    )}
                  </View>
                }
                onRefresh={handleRefetch}
                refreshing={isLoading}
                contentContainerStyle={{ paddingBottom: 180 + bottom }}
              />
            </View>
          </>
        )}

        {/* Floating action button - bottom right above bottom navbar */}
        <TouchableOpacity
          className='absolute right-6 w-16 h-16 rounded-full bg-white items-center justify-center'
          style={{
            elevation: 8,
            bottom: 0,
          }}
          onPress={handleCreateTemplate}
        >
          <View style={{ marginLeft: -6, marginTop: -6 }}>
            <Ionicons name='add-circle' size={68} color={'#5B67F5'} />
          </View>
        </TouchableOpacity>
      </View>
    </CustomSafeAreaView>
  );
};

export default MyTemplatesScreen;
