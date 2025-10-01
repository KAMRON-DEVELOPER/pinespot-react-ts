import type { AppState } from '@/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JwtPayload, Tokens, User } from '@/features/types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
}

const initialState: AuthState = {
  tokens: null,
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state = action.payload;
    },
    logout: () => initialState,
  },
  // extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {},
});

export const { setUser, logout } = slice.actions;
export default slice.reducer;

export const selectUser = (state: AppState) => state.auth.user;
export const selectIsAuthenticated = (state: AppState) => {
  const token = state.auth.tokens?.access_token;
  if (token != undefined) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const nowTimestamp = Date.now() * 1000;
      if (decoded.exp <= nowTimestamp) return false;
      return true;
    } catch (error) {
      console.log(`Jwt decode error, :${error}`);
      return false;
    }
  }
  return false;
};
export const selectAccessToken = (state: AppState) => state.auth.tokens?.access_token;
