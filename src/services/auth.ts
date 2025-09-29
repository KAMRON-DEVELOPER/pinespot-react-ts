import type { AuthResponse, OAuthUser, User } from '../features/auth/types';
import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (emailPassword) => ({
        url: '/auth/signup',
        method: 'POST',
        body: emailPassword,
      }),
      invalidatesTags: ['Auth'],
    }),
    signin: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (emailPassword) => ({
        url: '/auth/signin',
        method: 'POST',
        body: emailPassword,
      }),
      invalidatesTags: ['Auth'],
    }),
    getOauthUser: build.query<OAuthUser, void>({
      query: () => '/auth/google/me',
      providesTags: ['Auth'],
    }),
    completeProfile: build.mutation<AuthResponse, FormData>({
      query: (body) => ({
        url: '/auth/google/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
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
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetOauthUserQuery,
  useCompleteProfileMutation,
} = authApi;
