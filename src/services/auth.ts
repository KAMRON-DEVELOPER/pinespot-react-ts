import type {
  CompleteProfileResponse,
  ContinueWithEmailResponse,
  GetOAuthUserResponse,
  GetUserResponse,
  RefreshTokenResponse,
  UpdateUserResponse,
  User,
} from '@/features/types';
import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<GetUserResponse, void>({
      query: () => '/profile',
    }),
    updateProfile: build.mutation<UpdateUserResponse, User>({
      query: (body) => ({ url: '/profile', method: 'PATCH', body: body }),
      invalidatesTags: ['Auth'],
    }),
    deleteProfile: build.mutation<void, void>({
      query: () => ({ url: '/profile', method: 'DELETE' }),
      invalidatesTags: ['Auth'],
    }),
    continueWithEmail: build.mutation<ContinueWithEmailResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getOAuthUser: build.query<GetOAuthUserResponse, void>({
      query: () => '/auth/user',
      providesTags: ['Auth'],
    }),
    completeProfile: build.mutation<CompleteProfileResponse, FormData>({
      query: (body) => ({
        url: '/auth/complete',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: build.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
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
  useRefreshTokenMutation,
} = authApi;
