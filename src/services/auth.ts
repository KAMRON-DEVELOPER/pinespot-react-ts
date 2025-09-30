import type { AuthResponse, OAuthUser as GoogleOAuthUser, User } from '../features/auth/types';
import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<User, void>({
      query: () => '/profile',
    }),
    updateProfile: build.mutation<User, User>({
      query: (body) => ({ url: '/profile', method: 'PATCH', body: body }),
      invalidatesTags: ['Auth'],
    }),
    deleteProfile: build.mutation<void, void>({
      query: () => ({ url: '/profile', method: 'DELETE' }),
      invalidatesTags: ['Auth'],
    }),
    continueWithEmail: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getOAuthUser: build.query<GoogleOAuthUser, void>({
      query: () => '/auth/user',
      providesTags: ['Auth'],
    }),
    completeProfile: build.mutation<AuthResponse, FormData>({
      query: (body) => ({
        url: '/auth/complete',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useContinueWithEmailMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetOAuthUserQuery,
  useCompleteProfileMutation,
} = authApi;
