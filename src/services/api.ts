import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppState } from '@/store/store';
import { Mutex } from 'async-mutex';
import { logout } from '@/features/auth/authSlice';
import { API_URL } from '@/consts';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as AppState).auth.tokens?.accessToken;

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

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
        if (!refreshResult.error && refreshResult.data) {
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
