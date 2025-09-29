import type { AuthResponse, OAuthUser, User } from '../features/auth/types';
import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (emailPassword) => ({
        url: '/auth/register',
        method: 'POST',
        body: emailPassword,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (emailPassword) => ({
        url: '/auth/login',
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

export const { useLoginMutation, useGetProfileQuery, useUpdateProfileMutation, useDeleteProfileMutation, useGetOauthUserQuery, useCompleteProfileMutation } =
  authApi;
