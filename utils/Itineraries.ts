import { TemplateItinerary, TemplateItineraryWithId } from "@/types/templates";

const sortItineraries = (
  items: TemplateItineraryWithId[]
): TemplateItineraryWithId[] => {
  return [...items].sort((a, b) => {
    if (a.day !== b.day) {
      return a.day - b.day;
    }
    return a.startTime.localeCompare(b.startTime);
  });
};

const addItineraryIds = (
  items: TemplateItinerary[]
): TemplateItineraryWithId[] => {
  return items.map((item, index) => ({
    ...item,
    clientId: Date.now() + index,
  }));
};

const groupItinerariesByDay = (
  items: TemplateItineraryWithId[]
): Record<number, TemplateItineraryWithId[]> => {
  const sortedItems = sortItineraries(items);
  return sortedItems.reduce<Record<number, TemplateItineraryWithId[]>>(
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
  groupedItems: Record<number, TemplateItineraryWithId[]>
): TemplateItineraryWithId[] => {
  return Object.values(groupedItems).flat();
};

export { addItineraryIds, flattenItineraries, groupItinerariesByDay, sortItineraries };
