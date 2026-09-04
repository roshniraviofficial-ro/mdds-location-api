import { create } from 'zustand'

interface DashboardState {
  timeRange: '7d' | '30d' | '90d';
  setTimeRange: (range: '7d' | '30d' | '90d') => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (stateName: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timeRange: '7d',
  setTimeRange: (range) => set({ timeRange: range }),
  selectedStateFilter: 'All',
  setSelectedStateFilter: (stateName) => set({ selectedStateFilter: stateName }),
}))