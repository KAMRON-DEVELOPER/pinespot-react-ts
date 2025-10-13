import type { AppState } from '@/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface StatsState {
  totalUsers: number;
  totalListings: number;
}

const loadFromLocalStorage = (): StatsState => {
  try {
    const raw = localStorage.getItem('pinespot_stats');
    if (!raw) return { totalUsers: 0, totalListings: 0 };
    return JSON.parse(raw);
  } catch {
    return { totalUsers: 0, totalListings: 0 };
  }
};

const saveToLocalStorage = (state: StatsState) => {
  try {
    localStorage.setItem('pinespot_stats', JSON.stringify(state));
  } catch {
    // ignore errors silently
  }
};

const initialState: StatsState = loadFromLocalStorage();

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Partial<StatsState>>) => {
      if (action.payload.totalUsers !== undefined) state.totalUsers = action.payload.totalUsers;
      if (action.payload.totalListings !== undefined) state.totalListings = action.payload.totalListings;
      saveToLocalStorage(state);
    },
    incrementListings: (state) => {
      state.totalListings += 1;
      saveToLocalStorage(state);
    },
    resetStats: (state) => {
      state.totalUsers = 0;
      state.totalListings = 0;
      saveToLocalStorage(state);
    },
  },
});

export const { setStats, incrementListings, resetStats } = statsSlice.actions;
export default statsSlice.reducer;

export const selectStats = (state: AppState) => state.stats;
