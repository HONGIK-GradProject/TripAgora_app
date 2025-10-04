import { getItineraries, getTemplateDetails } from '@/services/templates';
import { TemplateItinerary } from '@/types/templates';
import { flattenItineraries, groupItinerariesByDay } from '@/utils/Itineraries';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

/**
 * 템플릿 상세 정보 관련 상태와 로직을 관리하는 내부 훅입니다.
 * 템플릿 ID를 기반으로 상세 정보와 일정 목록을 가져오고, 상태를 관리하는 다양한 함수를 제공합니다.
 * @param id - 상세 정보를 조회할 템플릿의 ID
 * @returns 템플릿 상세 정보 상태와 관리 함수들을 담은 객체
 */
const useTemplateDetailsLogic = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('샘플 여행 제목'); // 샘플 데이터용 제목
  const [content, setContent] = useState<string>('샘플 여행 상세 내용입니다.'); // 샘플 데이터용 내용
  const [regionIds, setRegionIds] = useState<number[]>([1]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<
    Record<number, TemplateItinerary[]>
  >({});
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);
  const [day, setDay] = useState<number>(1);

  /**
   * 서버에서 템플릿 상세 정보와 일정 목록을 비동기적으로 가져와 상태를 업데이트합니다.
   */
  const fetchTemplateDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getTemplateDetails(id);
      const itinerariesResponse = await getItineraries(+id);

      if (response && itinerariesResponse) {
        const itinerariesByDay = groupItinerariesByDay(itinerariesResponse.itineraries);
        setTitle(response.title);
        setContent(response.content);
        setRegionIds(response.regionIds);
        setTagIds(response.tagIds);
        setImageUrls(response.imageUrls);
        setItineraries(itinerariesByDay);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplateDetails();
  }, [fetchTemplateDetails]);

  /**
   * 새로운 일정 항목을 로컬 상태에 추가합니다. 시간순으로 정렬됩니다.
   * @param newItinerary - 추가할 새로운 일정 객체
   */
  const addItinerary = useCallback((newItinerary: TemplateItinerary) => {
    const day = newItinerary.day;
    setItineraries((prev) => {
      const dayItineraries = prev[day] || [];
      const updatedDayItineraries = [...dayItineraries, newItinerary].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
      return {
        ...prev,
        [day]: updatedDayItineraries,
      };
    });
  }, []);

  /**
   * 기존 일정 항목을 로컬 상태에서 업데이트합니다.
   * @param updatedItinerary - 업데이트할 일정 객체. ID를 기준으로 기존 항목을 찾습니다.
   */
  const updateItinerary = useCallback(
    (updatedItinerary: TemplateItinerary) => {
      setItineraries((prev) => {
        const flatList = flattenItineraries(prev);
        const updatedList = flatList.map((item) =>
          item.id === updatedItinerary.id ? updatedItinerary : item
        );
        return groupItinerariesByDay(updatedList);
      });
    },
    []
  );

  /**
   * 특정 일정 항목을 로컬 상태에서 삭제합니다.
   * @param itineraryId - 삭제할 일정 항목의 ID
   */
  const deleteItinerary = useCallback((itineraryId: number) => {
    setItineraries((prev) => {
      const flatList = flattenItineraries(prev);
      const updatedList = flatList.filter(
        (item) => item.id !== itineraryId
      );
      return groupItinerariesByDay(updatedList);
    });
  }, []);

  return {
    isLoading,
    title,
    content,
    regionIds,
    tagIds,
    imageUrls,
    itineraries,
    isEditingContent,
    isEditingTitle,
    day,
    setTagIds,
    setTitle,
    setContent,
    setRegionIds,
    setItineraries,
    setIsEditingTitle,
    setIsEditingContent,
    addItinerary,
    updateItinerary,
    deleteItinerary,
    refetch: fetchTemplateDetails,
    setDay,
  };
};

/**
 * 템플릿 상세 정보 상태를 공유하기 위한 React Context입니다.
 */
export const TemplateDetailsContext = createContext<
  ReturnType<typeof useTemplateDetailsLogic> | undefined
>(undefined);

/**
 * 하위 컴포넌트들에게 템플릿 상세 정보 컨텍스트를 제공하는 Provider 컴포넌트입니다.
 * `_layout.tsx`와 같은 레이아웃 컴포넌트에서 화면을 감싸는 데 사용됩니다.
 * @param children - 컨텍스트를 제공받을 자식 컴포넌트들
 * @param id - 상태를 초기화하고 데이터를 가져오는 데 사용될 템플릿의 ID
 */
export const TemplateDetailsProvider = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => {
  const templateDetails = useTemplateDetailsLogic(id);
  return (
    <TemplateDetailsContext.Provider value={templateDetails}>
      {children}
    </TemplateDetailsContext.Provider>
  );
};
