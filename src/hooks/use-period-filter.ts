'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'period-filter';

function getDefaultPeriod() {
  const now = new Date();
  return {
    month: now.getMonth().toString(),
    year: now.getFullYear().toString(),
  };
}

export function usePeriodFilter() {
  const [month, setMonthState] = useState(() => getDefaultPeriod().month);
  const [year, setYearState] = useState(() => getDefaultPeriod().year);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<{
          month: string;
          year: string;
        }>;
        if (parsed.month) setMonthState(parsed.month);
        if (parsed.year) setYearState(parsed.year);
      }
    } catch {
      // sessionStorage unavailable — keep defaults
    }
  }, []);

  const setMonth = useCallback((value: string) => {
    setMonthState(value);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, month: value })
      );
    } catch {}
  }, []);

  const setYear = useCallback((value: string) => {
    setYearState(value);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, year: value })
      );
    } catch {}
  }, []);

  return { month, year, setMonth, setYear };
}
