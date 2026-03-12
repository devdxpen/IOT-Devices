"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAnalyticsFilters } from "@/data/mockData";
import type { AnalyticsFilters } from "@/types/models";

interface AnalyticsFilterStore {
  filters: AnalyticsFilters;
  setFilter: <K extends keyof AnalyticsFilters>(
    key: K,
    value: AnalyticsFilters[K],
  ) => void;
  setFilters: (next: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
}

export const useAnalyticsFilters = create<AnalyticsFilterStore>()(
  persist(
    (set) => ({
      filters: defaultAnalyticsFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),
      setFilters: (next) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...next,
          },
        })),
      resetFilters: () =>
        set({
          filters: defaultAnalyticsFilters,
        }),
    }),
    {
      name: "iot-analytics-filters-v1",
      partialize: (state) => ({ filters: state.filters }),
    },
  ),
);
