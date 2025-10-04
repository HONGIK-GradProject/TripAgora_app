import { TemplateItinerary } from "@/types/templates";

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

const flattenItineraries = (
  groupedItems: Record<number, TemplateItinerary[]>
): TemplateItinerary[] => {
  return Object.values(groupedItems).flat();
};

export { flattenItineraries, groupItinerariesByDay, sortItineraries };

