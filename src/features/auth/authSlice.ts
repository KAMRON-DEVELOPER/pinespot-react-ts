import type { AppState } from '@/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JwtPayload, Tokens, User } from '@/features/types';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/services/auth';

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  tokens: null,
  user: null,
  status: 'idle',
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    setUser: (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.status = 'idle';
    },
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.continueWithEmail.matchFulfilled, (state, { payload }) => {
      if ('user' in payload && 'tokens' in payload) {
        state.user = payload.user;
        state.tokens = payload.tokens;
      }
    });
    builder.addMatcher(authApi.endpoints.completeProfile.matchFulfilled, (state, { payload }) => {
      if ('user' in payload && 'tokens' in payload) {
        state.user = payload.user;
        state.tokens = payload.tokens;
      }
    });
    builder.addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      if ('id' in payload) {
        state.user = payload;
      }
    });
    builder.addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
      if ('accessToken' in payload) {
        state.tokens = payload;
      }
    });
  },
});

export const { setAuthLoading, setUser, setTokens, logout } = slice.actions;
export default slice.reducer;

export const selectUser = (state: AppState) => state.auth.user;
export const selectIsAuthenticated = (state: AppState) => {
  const token = state.auth.tokens?.accessToken;
  if (token != undefined) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const nowTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp <= nowTimestamp) return false;
      return true;
    } catch (error) {
      console.log(`Jwt decode error, :${error}`);
      return false;
    }
  }
  return false;
};
export const selectAccessToken = (state: AppState) => state.auth.tokens?.accessToken;
