import type { ApiResponse, GetListingsResponse } from '@/features/types';
import { api } from './api';
import type { ListingParams } from '@/components/filter/AdvancedFilters';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<GetListingsResponse, ListingParams | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '' || v === 'any') return;
            qs.set(k, String(v));
          });
        }
        const queryString = qs.toString();
        return `listings${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Listing'],
    }),
    createListing: builder.mutation<ApiResponse<{ message: string }>, FormData>({
      query: (body) => ({
        url: '/listings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Listing'],
    }),
    getStats: builder.query<{ totalUsers: number; totalListings: number }, void>({
      query: () => 'listings/stats',
      providesTags: ['Listing'],
    }),
  }),
});

export const { useGetListingsQuery, useGetStatsQuery, useCreateListingMutation } = listingApi;
