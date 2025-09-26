import { type RootState } from '@/store/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { id: string; name: string; email: string; avatarUrl?: string };
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'complete-profile';
}

const initialState: AuthState = {
  user: null,
  status: 'unauthenticated',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
