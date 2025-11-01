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
      console.log('템플릿 생성 실패: ', error);
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
    <View className='flex-1 bg-white pt-12 relative'>
      <SearchWithAutoComplete
        query={searchQuery}
        onQueryChange={setSearchQuery}
        fetchSuggestions={handleFetchSuggestions}
        onSearch={handleSearch}
        placeholder='제목으로 템플릿을 검색해보세요!'
      />

      {/* 초기 로딩 처리 */}
      {isLoading && templates.length === 0 ? (
        <FullScreenLoader />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          오류가 발생했습니다.
        </Text>
      ) : (
        <>
          <View className='px-5'>
            <Text className='text-3xl font-bold mb-5'>내 상품 템플릿</Text>
          </View>
          <View
            className='bg-gray-50 rounded-2xl p-4'
            style={{ marginBottom: 16 + bottom }}
          >
            <GuideTemplateList
              templates={filteredTemplates}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              onRefresh={handleRefetch}
              refreshing={isLoading}
              contentContainerStyle={{ paddingBottom: 80 + bottom }}
            />
          </View>
        </>
      )}

      {/* Floating action button - bottom right above bottom navbar */}
      <TouchableOpacity
        className='absolute right-6 w-16 h-16 rounded-full bg-white items-center justify-center'
        style={{
          elevation: 8,
          bottom: bottom + 20,
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

export default MyTemplatesScreen;
