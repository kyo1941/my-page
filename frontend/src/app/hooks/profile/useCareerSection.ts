import { useMemo, useCallback } from 'react';
import { careerData, CURRENT_TERM } from '@/app/data/careerData';
import { parseDate } from '@/app/utils/parseDate';

export function useCareerSection() {
  const now = useMemo(() => new Date(), []);

  const isCurrent = useCallback((period: string) => {
    const [startDateStr, endDateStr] = period.split(' - ');
    if (!startDateStr || !endDateStr) return false;
    const startDate = parseDate(startDateStr);
    if (isNaN(startDate.getTime())) return false;
    if (endDateStr === CURRENT_TERM) {
      return startDate <= now;
    }
    const endDate = parseDate(endDateStr);
    if (isNaN(endDate.getTime())) return false;
    if (startDate > endDate) return false;
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    return startDate <= now && now <= endDate;
  }, [now]);

  const processedCareerData = useMemo(() => {
    return careerData.map((career) => ({
      ...career,
      isCurrent: isCurrent(career.period)
    }));
  }, [isCurrent]);

  return { processedCareerData };
}
