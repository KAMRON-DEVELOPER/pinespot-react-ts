import { type Action, configureStore, type ThunkAction } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@/services/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([api.middleware]);
  },
  devTools: true,
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
