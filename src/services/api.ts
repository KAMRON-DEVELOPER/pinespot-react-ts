import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppState } from '@/store/store';
import { Mutex } from 'async-mutex';
import { logout, setTokens } from '@/features/auth/authSlice';
import type { Tokens } from '@/features/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1/';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as AppState).auth.tokens?.accessToken;
    console.log('accessToken is ', token);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  console.log('result.data is ', result.data);
  console.log('result.error is ', result.error);
  console.log('result.meta is ', result.meta);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
        console.log('refreshResult.data is ', refreshResult.data);
        console.log('refreshResult.error is ', refreshResult.error);
        console.log('refreshResult.meta is ', refreshResult.meta);
        if (!refreshResult.error && refreshResult.data) {
          api.dispatch(setTokens(refreshResult.data as Tokens));
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log('Refresh token is invalid, logging out.');
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Listing'],
  endpoints: () => ({}),
});
