import { getItineraries, getTemplateDetails } from '@/services/templates';
import { TemplateItineraryWithId } from '@/types/templates';
import { addItineraryIds, flattenItineraries, groupItinerariesByDay } from '@/utils/Itineraries';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';


// --- Internal Hook with State Logic ---
// Note: This hook contains the actual state and logic.
const useTemplateDetailsLogic = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('샘플 여행 제목'); // 샘플 데이터용 제목
  const [content, setContent] = useState<string>('샘플 여행 상세 내용입니다.'); // 샘플 데이터용 내용
  const [regionIds, setRegionIds] = useState<number[]>([1]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<
    Record<number, TemplateItineraryWithId[]>
  >({});
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);
  const [day, setDay] = useState<number>(1);

  const fetchTemplateDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getTemplateDetails(id);
      const itinerariesResponse = await getItineraries(+id);

      if (response && itinerariesResponse) {
        const itinerariesWithId = addItineraryIds(
          itinerariesResponse.itineraries
        );
        setTitle(response.title);
        setContent(response.content);
        setRegionIds(response.regionIds);
        setTagIds(response.tagIds);
        setImageUrls(response.imageUrls);
        setItineraries(groupItinerariesByDay(itinerariesWithId));
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

  const addItinerary = useCallback((newItinerary: TemplateItineraryWithId) => {
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

  const updateItinerary = useCallback(
    (updatedItinerary: TemplateItineraryWithId) => {
      setItineraries((prev) => {
        const flatList = flattenItineraries(prev);
        const updatedList = flatList.map((item) =>
          item.clientId === updatedItinerary.clientId ? updatedItinerary : item
        );
        return groupItinerariesByDay(updatedList);
      });
    },
    []
  );

  const deleteItinerary = useCallback((itineraryId: number) => {
    setItineraries((prev) => {
      const flatList = flattenItineraries(prev);
      const updatedList = flatList.filter(
        (item) => item.clientId !== itineraryId
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

// --- Context Definition ---
// The context will have a value matching the return type of our logic hook.
export const TemplateDetailsContext = createContext<
  ReturnType<typeof useTemplateDetailsLogic> | undefined
>(undefined);

// --- Provider Component ---
// This component will wrap our screen layout.
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
