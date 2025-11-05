import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import InterestTag from '@/components/InterestTag';
import SearchWithAutoComplete from '@/components/search-bar/SearchWithAutoComplete';
import TravelerProductList from '@/components/traveler/explore/TravelerProductList';
import { REGION_DATA, REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { INTEREST_TAGS } from '@/constants/Tags';
import { searchSessions } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TravelerExploreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 필터 상태
  const [searchStartDate, setSearchStartDate] = useState<Date | undefined>(
    undefined
  );
  const [searchEndDate, setSearchEndDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // 모달 상태
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>(
    'start'
  );

  const { bottom } = useSafeAreaInsets();

  // useRef를 사용하여 의존성 배열로 인한 무한 루프를 방지합니다.
  const stateRef = useRef({
    isLoading,
    hasNextPage,
    page,
    submittedQuery,
    searchStartDate,
    searchEndDate,
    selectedRegionIds,
    selectedTagIds,
  });
  stateRef.current = {
    isLoading,
    hasNextPage,
    page,
    submittedQuery,
    searchStartDate,
    searchEndDate,
    selectedRegionIds,
    selectedTagIds,
  };

  // 날짜를 yyyy-MM-dd 형식으로 변환
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 세션 검색/조회 함수
  const fetchSessions = useCallback(async (isRefresh: boolean) => {
    const pageToLoad = isRefresh ? 0 : stateRef.current.page;
    const keyword = stateRef.current.submittedQuery.trim() || undefined;
    const startDate = stateRef.current.searchStartDate
      ? formatDate(stateRef.current.searchStartDate)
      : undefined;
    const endDate = stateRef.current.searchEndDate
      ? formatDate(stateRef.current.searchEndDate)
      : undefined;
    const regionIds =
      stateRef.current.selectedRegionIds.length > 0
        ? stateRef.current.selectedRegionIds
        : undefined;
    const tagIds =
      stateRef.current.selectedTagIds.length > 0
        ? stateRef.current.selectedTagIds
        : undefined;

    // ref를 통해 최신 상태를 확인합니다.
    if (
      stateRef.current.isLoading ||
      (!isRefresh && !stateRef.current.hasNextPage)
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchSessions(
        keyword,
        startDate,
        endDate,
        regionIds,
        tagIds,
        pageToLoad
      );

      if (response) {
        setSessions((prev) =>
          isRefresh ? response.sessions : [...prev, ...response.sessions]
        );
        setPage(pageToLoad + 1);
        setHasNextPage(response.hasNext);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      setError(err as Error);
      console.error('세션 검색 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (stateRef.current.hasNextPage && !stateRef.current.isLoading) {
      fetchSessions(false);
    }
  }, [fetchSessions]);

  const refetch = useCallback(() => {
    fetchSessions(true);
  }, [fetchSessions]);

  // 검색어 및 필터 변경 시 검색 실행
  useEffect(() => {
    fetchSessions(true);
  }, [
    submittedQuery,
    searchStartDate,
    searchEndDate,
    selectedRegionIds,
    selectedTagIds,
    fetchSessions,
  ]);

  // 세션 데이터를 Product 형태로 변환
  const products = useMemo(() => {
    return sessions.map((session) => ({
      id: session.sessionId.toString(),
      title: session.title,
      date: `${session.startDate} - ${session.endDate}`,
      participants: `${session.currentParticipants}/${session.maxParticipants}명`,
      location:
        session.regionIds && session.regionIds.length > 0
          ? session.regionIds
              .map((id) => REGION_ID_TO_NAME_MAP[id])
              .filter(Boolean)
              .join(', ')
          : '',
      guide: '가이드',
      rating: '-' as const,
      imageUrl: session.firstImageUrl,
    }));
  }, [sessions]);

  const handleFetchSuggestions = async (query: string) => {
    return [];
  };

  const handleSearch = (query: string) => {
    setSubmittedQuery(query);
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '' && submittedQuery.trim() !== '') {
      setSubmittedQuery('');
    }
  };

  // 날짜 선택 핸들러
  const handleDateChange = (
    event: { type: string },
    selectedDate?: Date,
    mode: 'start' | 'end' = datePickerMode
  ) => {
    // Android에서 취소 버튼을 누른 경우
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
        return;
      }
      setShowDatePicker(false);
    }

    // 선택된 날짜가 있고, 취소가 아닌 경우에만 날짜 설정
    if (selectedDate && event.type !== 'dismissed') {
      if (mode === 'start') {
        setSearchStartDate(selectedDate);
        // 시작일이 종료일보다 나중이면 종료일도 초기화
        if (searchEndDate && selectedDate > searchEndDate) {
          setSearchEndDate(undefined);
        }
      } else {
        // 종료일은 시작일보다 이전이면 안 됨
        if (searchStartDate && selectedDate < searchStartDate) {
          return;
        }
        setSearchEndDate(selectedDate);
      }
    }

    // iOS는 spinner 방식이므로 계속 표시
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    }
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  // 지역 선택 핸들러
  const toggleRegion = (regionId: number) => {
    setSelectedRegionIds((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  const clearRegions = () => {
    setSelectedRegionIds([]);
  };

  // 태그 선택 핸들러 - 최대 5개까지 선택 가능
  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        // 최대 5개까지만 선택 가능
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, tagId];
      }
    });
  };

  const clearTags = () => {
    setSelectedTagIds([]);
  };

  // 상위 지역 목록
  const parentRegions = useMemo(() => Object.keys(REGION_DATA), []);
  const [selectedParentRegion, setSelectedParentRegion] = useState<string>(
    () => parentRegions[0] || ''
  );

  // 선택된 상위 지역의 하위 지역 목록
  const childRegions = useMemo(() => {
    return selectedParentRegion ? REGION_DATA[selectedParentRegion] : [];
  }, [selectedParentRegion]);

  return (
    <CustomSafeAreaView>
      <View className='bg-white pt-6 relative'>
        <SearchWithAutoComplete
          query={searchQuery}
          onQueryChange={handleQueryChange}
          fetchSuggestions={handleFetchSuggestions}
          onSearch={handleSearch}
          placeholder='여행 상품을 검색해보세요!'
        />

        {/* 필터 버튼들 */}
        <View className='px-5 mb-4 pt-1'>
          {/* 날짜 선택 - 시작일과 종료일 */}
          <View className='flex-row justify-between mb-3'>
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-2xl border mr-2 ${
                searchStartDate
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => openDatePicker('start')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name='calendar-start'
                size={18}
                color={searchStartDate ? '#8130FF' : '#6B7280'}
              />
              <View className='ml-2 flex-1'>
                <Text className='text-xs text-gray-500 mb-0.5'>시작일</Text>
                <Text
                  className={`text-sm ${
                    searchStartDate ? 'text-primary font-medium' : 'text-gray-600'
                  }`}
                >
                  {searchStartDate ? formatDate(searchStartDate) : '선택'}
                </Text>
              </View>
              {searchStartDate && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSearchStartDate(undefined);
                  }}
                  className='ml-2'
                >
                  <Ionicons name='close-circle' size={16} color='#8130FF' />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-2xl border ${
                searchEndDate
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => openDatePicker('end')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name='calendar-end'
                size={18}
                color={searchEndDate ? '#8130FF' : '#6B7280'}
              />
              <View className='ml-2 flex-1'>
                <Text className='text-xs text-gray-500 mb-0.5'>종료일</Text>
                <Text
                  className={`text-sm ${
                    searchEndDate ? 'text-primary font-medium' : 'text-gray-600'
                  }`}
                >
                  {searchEndDate ? formatDate(searchEndDate) : '선택'}
                </Text>
              </View>
              {searchEndDate && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSearchEndDate(undefined);
                  }}
                  className='ml-2'
                >
                  <Ionicons name='close-circle' size={16} color='#8130FF' />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* 지역 선택과 관심사 선택 */}
          <View className='flex-row justify-between'>
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-2xl border mr-2 ${
                selectedRegionIds.length > 0
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => setShowRegionModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name='location'
                size={18}
                color={selectedRegionIds.length > 0 ? '#8130FF' : '#6B7280'}
              />
              <Text
                className={`text-sm ml-2 ${
                  selectedRegionIds.length > 0 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {selectedRegionIds.length > 0
                  ? `지역 ${selectedRegionIds.length}개`
                  : '지역 선택'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-2xl border ${
                selectedTagIds.length > 0
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => setShowTagModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name='pricetag'
                size={18}
                color={selectedTagIds.length > 0 ? '#8130FF' : '#6B7280'}
              />
              <Text
                className={`text-sm ml-2 ${
                  selectedTagIds.length > 0 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {selectedTagIds.length > 0
                  ? `관심사 ${selectedTagIds.length}개`
                  : '관심사 선택'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 날짜 선택 모달 */}
        {showDatePicker && (
          <DateTimePicker
            value={
              datePickerMode === 'start' && searchStartDate
                ? searchStartDate
                : datePickerMode === 'end' && searchEndDate
                ? searchEndDate
                : new Date()
            }
            mode='date'
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) =>
              handleDateChange(event, date, datePickerMode)
            }
            minimumDate={
              datePickerMode === 'end' && searchStartDate
                ? searchStartDate
                : new Date()
            }
          />
        )}

        {/* 지역 선택 모달 */}
        <Modal
          visible={showRegionModal}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setShowRegionModal(false)}
        >
          <View className='flex-1 bg-black/50 justify-end'>
            <View
              className='bg-white rounded-t-3xl'
              style={{ maxHeight: '80%', height: '80%' }}
            >
              <View className='flex-row justify-between items-center p-5 border-b border-gray-200'>
                <Text className='text-xl font-bold'>지역 선택</Text>
                <View className='flex-row'>
                  {selectedRegionIds.length > 0 && (
                    <TouchableOpacity onPress={clearRegions} className='mr-4'>
                      <Text className='text-primary text-base'>초기화</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setShowRegionModal(false)}>
                    <Ionicons name='close' size={24} color='#111827' />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 선택된 지역 표시 */}
              {selectedRegionIds.length > 0 && (
                <View className='flex-row flex-wrap px-5 py-3 gap-2 border-b border-gray-200'>
                  {selectedRegionIds.map((regionId) => {
                    const regionName = REGION_ID_TO_NAME_MAP[regionId];
                    return (
                      <View
                        key={regionId}
                        className='flex-row items-center px-3 py-1 rounded-full bg-primary/20'
                      >
                        <Text className='text-primary text-sm mr-1'>
                          {regionName}
                        </Text>
                        <TouchableOpacity onPress={() => toggleRegion(regionId)}>
                          <Ionicons
                            name='close-circle'
                            size={16}
                            color='#8130FF'
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* 지역 선택 영역 */}
              <View className='flex-row' style={{ flex: 1, minHeight: 0 }}>
                {/* 상위 지역 목록 */}
                <ScrollView
                  className='border-r border-gray-200'
                  style={{ width: '33.333%' }}
                >
                  <View className='py-2'>
                    {parentRegions.map((parent) => {
                      const isActive = parent === selectedParentRegion;
                      return (
                        <TouchableOpacity
                          key={parent}
                          className={`px-4 py-3 ${
                            isActive ? 'bg-primary/10' : 'bg-white'
                          }`}
                          onPress={() => setSelectedParentRegion(parent)}
                        >
                          <Text
                            className={`text-sm ${
                              isActive
                                ? 'text-primary font-semibold'
                                : 'text-gray-700'
                            }`}
                          >
                            {parent.length > 2 ? parent.slice(0, -2) : parent}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* 하위 지역 목록 */}
                <ScrollView style={{ width: '66.667%' }}>
                  <View className='py-2'>
                    {childRegions.map((region) => {
                      const isSelected = selectedRegionIds.includes(region.id);
                      return (
                        <TouchableOpacity
                          key={region.id}
                          className={`px-5 py-3 ${
                            isSelected ? 'bg-primary/10' : 'bg-white'
                          }`}
                          onPress={() => toggleRegion(region.id)}
                        >
                          <Text
                            className={`text-sm ${
                              isSelected
                                ? 'text-primary font-semibold'
                                : 'text-gray-700'
                            }`}
                          >
                            {region.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

        {/* 태그 선택 모달 */}
        <Modal
          visible={showTagModal}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setShowTagModal(false)}
        >
          <View className='flex-1 bg-black/50 justify-end'>
            <View className='bg-white rounded-t-3xl max-h-[80%]'>
              <View className='flex-row justify-between items-center p-5 border-b border-gray-200'>
                <View>
                  <Text className='text-xl font-bold'>관심사 선택</Text>
                  <Text className='text-xs text-gray-500 mt-1'>
                    최대 5개까지 선택 가능 ({selectedTagIds.length}/5)
                  </Text>
                </View>
                <View className='flex-row'>
                  {selectedTagIds.length > 0 && (
                    <TouchableOpacity onPress={clearTags} className='mr-4'>
                      <Text className='text-primary text-base'>초기화</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setShowTagModal(false)}>
                    <Ionicons name='close' size={24} color='#111827' />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className='p-5'>
                <View className='flex-row flex-wrap'>
                  {INTEREST_TAGS.map((tag) => (
                    <InterestTag
                      key={tag.id}
                      tag={tag.name}
                      isSelected={selectedTagIds.includes(tag.id)}
                      onPress={() => toggleTag(tag.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View
          className='bg-gray-50 rounded-2xl p-4'
          style={{ marginBottom: 200 + insets.bottom }}
        >
          {error ? (
            <View className='flex-1 items-center justify-center py-20'>
              <Text className='text-red-500 text-lg'>
                세션 목록을 불러오는데 실패했습니다.
              </Text>
              <TouchableOpacity
                className='mt-4 px-6 py-3 bg-primary rounded-lg'
                onPress={refetch}
              >
                <Text className='text-white font-semibold'>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 && !isLoading ? (
            <View className='flex-1 items-center justify-center py-20'>
              <Text className='text-gray-500 text-lg'>
                모집 중인 여행이 없습니다.
              </Text>
            </View>
          ) : (
            <TravelerProductList
              products={products}
              onEndReached={loadMore}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading && sessions.length === 0}
                  onRefresh={refetch}
                  colors={['#8130FF']}
                  tintColor='#8130FF'
                />
              }
              ListFooterComponent={
                isLoading && sessions.length > 0 ? (
                  <View className='py-4 items-center'>
                    <ActivityIndicator size='small' color='#8130FF' />
                    <Text className='text-gray-500 text-sm mt-2'>
                      더 많은 세션을 불러오는 중...
                    </Text>
                  </View>
                ) : undefined
              }
              contentContainerStyle={{ paddingBottom: bottom + 160 }}
            />
          )}
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default TravelerExploreScreen;
