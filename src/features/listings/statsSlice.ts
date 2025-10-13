import type { AppState } from '@/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface StatsState {
  users: number;
  listings: number;
}

const loadFromLocalStorage = (): StatsState => {
  try {
    const raw = localStorage.getItem('pinespot_stats');
    if (!raw) return { users: 0, listings: 0 };
    return JSON.parse(raw);
  } catch {
    return { users: 0, listings: 0 };
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
      if (action.payload.users !== undefined) state.users = action.payload.users;
      if (action.payload.listings !== undefined) state.listings = action.payload.listings;
      saveToLocalStorage(state);
    },
    incrementListings: (state) => {
      state.listings += 1;
      saveToLocalStorage(state);
    },
    resetStats: (state) => {
      state.users = 0;
      state.listings = 0;
      saveToLocalStorage(state);
    },
  },
});

export const { setStats, incrementListings, resetStats } = statsSlice.actions;
export default statsSlice.reducer;

export const selectStats = (state: AppState) => state.stats;
