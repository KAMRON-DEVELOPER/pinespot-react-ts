import type { GetListingsResponse } from '@/features/types';
import { api } from './api';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<GetListingsResponse, Record<string, string | number | boolean | undefined> | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '') return;
            qs.set(k, String(v));
          });
        }
        const queryString = qs.toString();
        return `listings${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Listing'],
    }),
    getStats: builder.query<{ totalUsers: number; totalListings: number }, void>({
      query: () => 'listings/stats',
      providesTags: ['Listing'],
    }),
  }),
});

export const { useGetListingsQuery, useGetStatsQuery } = listingApi;
