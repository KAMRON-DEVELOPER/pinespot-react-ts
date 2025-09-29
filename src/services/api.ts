import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config';
import type { RootState } from '@/store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).auth.tokens?.access_token;
    if (token) {
      headers.set('Authentication', token);
    }

    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 6 });

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Auth', 'Listings'],
  endpoints: () => ({}),
});
