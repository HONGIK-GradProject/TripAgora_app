import { getItineraries, getTemplateDetails } from "@/services/templates";
import { TemplateItinerary, TemplateItineraryWithId } from "@/types/templates";
import React, { createContext, ReactNode, useCallback, useEffect, useState } from "react";

// --- Helper Functions ---
const sortItineraries = (items: TemplateItineraryWithId[]): TemplateItineraryWithId[] => {
  return [...items].sort((a, b) => {
    if (a.day !== b.day) {
      return a.day - b.day;
    }
    return a.startTime.localeCompare(b.startTime);
  });
};

const addItineraryIds = (items: TemplateItinerary[]): TemplateItineraryWithId[] => {
  return items.map((item, index) => ({
    ...item,
    clientId: Date.now() + index,
  }));
};

// --- Sample Data ---
const sampleItineraries: TemplateItineraryWithId[] = [
  {
    clientId: 1,
    day: 1,
    startTime: '09:00:00',
    title: '경복궁 관람',
    content: '조선 왕조의 법궁인 경복궁을 둘러봅니다. 한복을 입고 사진을 찍어보세요.',
    latitude: 37.579617,
    longitude: 126.977041,
  },
  {
    clientId: 2,
    day: 1,
    startTime: '12:30:00',
    title: '토속촌 삼계탕',
    content: '경복궁 근처의 유명한 삼계탕 맛집에서 점심 식사를 합니다.',
    latitude: 37.5805,
    longitude: 126.9722,
  },
  {
    clientId: 3,
    day: 1,
    startTime: '14:00:00',
    title: '북촌 한옥마을 산책',
    content: '전통 한옥의 아름다움을 느끼며 여유롭게 산책합니다.',
    latitude: 37.5827,
    longitude: 126.9836,
  },
  {
    clientId: 4,
    day: 2,
    startTime: '10:00:00',
    title: '남산서울타워',
    content: '서울의 전경을 한눈에 담을 수 있는 남산서울타워에 오릅니다.',
    latitude: 37.5512,
    longitude: 126.9882,
  },
];

// --- Internal Hook with State Logic ---
// Note: This hook contains the actual state and logic.
const useTemplateDetailsLogic = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('샘플 여행 제목'); // 샘플 데이터용 제목
  const [content, setContent] = useState<string>('샘플 여행 상세 내용입니다.'); // 샘플 데이터용 내용
  const [regionNames, setRegionNames] = useState<string[]>(['서울']);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<TemplateItineraryWithId[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await getTemplateDetails(id);
        const itinerariesResponse = await getItineraries(+id);

        if (response && itinerariesResponse) {
          const itinerariesWithId = addItineraryIds(itinerariesResponse.itineraries);
          setTitle(response.title);
          setContent(response.content);
          setRegionNames(response.regionNames);
          setTagNames(response.tagNames);
          setImageUrls(response.imageUrls);
          setItineraries(sortItineraries(itinerariesWithId));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateDetails();
  }, [id]);

  const addItinerary = useCallback((newItinerary: TemplateItineraryWithId) => {
    setItineraries((prev) => sortItineraries([...prev, newItinerary]));
  }, []);

  const updateItinerary = useCallback((updatedItinerary: TemplateItineraryWithId) => {
    setItineraries((prev) => {
      const updatedList = prev.map((item) =>
        item.clientId === updatedItinerary.clientId ? updatedItinerary : item
      );
      return sortItineraries(updatedList);
    });
  }, []);

  const deleteItinerary = useCallback((itineraryId: number) => {
    setItineraries((prev) => prev.filter((item) => item.clientId !== itineraryId));
  }, []);

  return {
    isLoading,
    title,
    content,
    regionNames,
    tagNames,
    imageUrls,
    itineraries,
    isEditingContent,
    isEditingTitle,
    setTitle,
    setContent,
    setRegionNames,
    setItineraries,
    setIsEditingTitle,
    setIsEditingContent,
    addItinerary,
    updateItinerary,
    deleteItinerary,
  };
};

// --- Context Definition ---
// The context will have a value matching the return type of our logic hook.
export const TemplateDetailsContext = createContext<ReturnType<typeof useTemplateDetailsLogic> | undefined>(
  undefined
);

// --- Provider Component ---
// This component will wrap our screen layout.
export const TemplateDetailsProvider = ({ children, id }: { children: ReactNode; id: string }) => {
  const templateDetails = useTemplateDetailsLogic(id);
  return (
    <TemplateDetailsContext.Provider value={templateDetails}>
      {children}
    </TemplateDetailsContext.Provider>
  );
};
