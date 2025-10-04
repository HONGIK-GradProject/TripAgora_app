import { TemplateItinerary } from "@/types/templates";

/**
 * 일정 항목 배열을 `day` 오름차순, 그리고 각 `day` 내에서 `startTime` 오름차순으로 정렬합니다.
 * @param items - 정렬할 `TemplateItinerary` 객체의 배열
 * @returns 정렬된 새로운 `TemplateItinerary` 배열
 */
const sortItineraries = (
  items: TemplateItinerary[]
): TemplateItinerary[] => {
  return [...items].sort((a, b) => {
    if (a.day !== b.day) {
      return a.day - b.day;
    }
    return a.startTime.localeCompare(b.startTime);
  });
};

/**
 * 일정 항목의 배열을 `day`를 기준으로 그룹화하여 객체 형태로 반환합니다.
 * @param items - 그룹화할 `TemplateItinerary` 객체의 배열
 * @returns 키가 `day`이고 값이 해당 날짜의 일정 배열인 `Record<number, TemplateItinerary[]>` 객체
 */
const groupItinerariesByDay = (
  items: TemplateItinerary[]
): Record<number, TemplateItinerary[]> => {
  const sortedItems = sortItineraries(items);
  return sortedItems.reduce<Record<number, TemplateItinerary[]>>(
    (acc, item) => {
      const day = item.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    },
    {}
  );
};

/**
 * `day`별로 그룹화된 일정 객체를 단일 배열 형태로 펼칩니다.
 * @param groupedItems - 그룹화된 `Record<number, TemplateItinerary[]>` 객체
 * @returns 모든 일정 항목을 포함하는 단일 `TemplateItinerary` 배열
 */
const flattenItineraries = (
  groupedItems: Record<number, TemplateItinerary[]>
): TemplateItinerary[] => {
  return Object.values(groupedItems).flat();
};

export { flattenItineraries, groupItinerariesByDay, sortItineraries };

