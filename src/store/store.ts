import { type Action, configureStore, type ThunkAction } from '@reduxjs/toolkit';
import auth from '@/features/auth/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@/services/api';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([api.middleware]);
  },
  devTools: true,
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, AppState, unknown, Action>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
