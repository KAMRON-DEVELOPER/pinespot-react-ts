import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import postsReducer from '@/features/posts/postsSlice';
import authReducer from '@/features/auth/authSlice';
import usersReducer from '@/features/users/usersSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    users: usersReducer,
    auth: authReducer,
  },
  devTools: true,
});

// Infer the type of `store`
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
