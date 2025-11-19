import { getSessionItineraries } from '@/services/sessions';
import { TemplateItinerary } from '@/types/templates';
import { flattenItineraries, groupItinerariesByDay } from '@/utils/Itineraries';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ensureDayKeys = (
  source: Record<number, TemplateItinerary[]>,
  baseDays: number[] = []
): Record<number, TemplateItinerary[]> => {
  const daySet = new Set<number>([
    ...baseDays,
    ...Object.keys(source)
      .map(Number)
      .filter((value) => Number.isFinite(value)),
  ]);

  if (daySet.size === 0) {
    daySet.add(1);
  }

  const sortedDays = Array.from(daySet).sort((a, b) => a - b);
  return sortedDays.reduce<Record<number, TemplateItinerary[]>>((acc, day) => {
    acc[day] = source[day] ? [...source[day]] : [];
    return acc;
  }, {});
};

const useSessionItineraryEditorLogic = (sessionId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itineraries, setItineraries] = useState<
    Record<number, TemplateItinerary[]>
  >({
    1: [],
  });
  const [day, setDay] = useState(1);

  const fetchItineraries = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const numericSessionId = Number(sessionId);
      if (Number.isNaN(numericSessionId)) {
        throw new Error('세션 ID가 올바르지 않습니다.');
      }

      const response = await getSessionItineraries(numericSessionId);
      if (response) {
        const sanitized = response.itineraries.map(
          ({ startDate, ...rest }) => ({
            ...rest,
          })
        );
        const grouped = ensureDayKeys(
          groupItinerariesByDay(sanitized as TemplateItinerary[])
        );
        setItineraries(grouped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const availableDays = useMemo(
    () =>
      Object.keys(itineraries)
        .map(Number)
        .filter((value) => Number.isFinite(value)),
    [itineraries]
  );

  useEffect(() => {
    if (availableDays.length === 0) {
      if (day !== 1) {
        setDay(1);
      }
      return;
    }

    if (!availableDays.includes(day)) {
      const nextDay = availableDays.find((availableDay) => availableDay > day);
      setDay(nextDay ?? availableDays[availableDays.length - 1]);
    }
  }, [availableDays, day]);

  const addItinerary = useCallback((newItinerary: TemplateItinerary) => {
    const targetDay = newItinerary.day;
    setItineraries((prev) => {
      const baseDays = Object.keys(prev)
        .map(Number)
        .filter((value) => Number.isFinite(value));
      const dayItineraries = prev[targetDay] || [];
      const updatedDayItineraries = [...dayItineraries, newItinerary].sort(
        (a, b) => a.startTime.localeCompare(b.startTime)
      );
      const draft = {
        ...prev,
        [targetDay]: updatedDayItineraries,
      };
      return ensureDayKeys(
        draft,
        baseDays.includes(targetDay) ? baseDays : [...baseDays, targetDay]
      );
    });
  }, []);

  const updateItinerary = useCallback((updatedItinerary: TemplateItinerary) => {
    setItineraries((prev) => {
      const baseDays = Object.keys(prev)
        .map(Number)
        .filter((value) => Number.isFinite(value));
      const flatList = flattenItineraries(prev);
      const updatedList = flatList.map((item) =>
        item.id === updatedItinerary.id ? updatedItinerary : item
      );
      const grouped = groupItinerariesByDay(updatedList);
      return ensureDayKeys(grouped, baseDays);
    });
  }, []);

  const deleteItinerary = useCallback((itineraryId: number) => {
    setItineraries((prev) => {
      const baseDays = Object.keys(prev)
        .map(Number)
        .filter((value) => Number.isFinite(value));
      const flatList = flattenItineraries(prev);
      const updatedList = flatList.filter((item) => item.id !== itineraryId);
      const grouped = groupItinerariesByDay(updatedList);
      return ensureDayKeys(grouped, baseDays);
    });
  }, []);

  const addDay = useCallback(() => {
    let nextDayValue = 1;
    setItineraries((prev) => {
      const baseDays = Object.keys(prev)
        .map(Number)
        .filter((value) => Number.isFinite(value));
      const maxDay = baseDays.length === 0 ? 0 : Math.max(...baseDays);
      nextDayValue = maxDay + 1;

      if (prev[nextDayValue]) {
        return prev;
      }

      const draft = {
        ...prev,
        [nextDayValue]: [],
      };

      return ensureDayKeys(draft, [...baseDays, nextDayValue]);
    });
    setDay(nextDayValue);
    return nextDayValue;
  }, []);

  return {
    isLoading,
    itineraries,
    day,
    setDay,
    addDay,
    addItinerary,
    updateItinerary,
    deleteItinerary,
    refetch: fetchItineraries,
  };
};

export const SessionItineraryEditorContext = createContext<
  ReturnType<typeof useSessionItineraryEditorLogic> | undefined
>(undefined);

export const SessionItineraryEditorProvider = ({
  children,
  sessionId,
}: {
  children: ReactNode;
  sessionId: string;
}) => {
  const value = useSessionItineraryEditorLogic(sessionId);
  return (
    <SessionItineraryEditorContext.Provider value={value}>
      {children}
    </SessionItineraryEditorContext.Provider>
  );
};
