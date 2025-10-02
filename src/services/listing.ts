import type { GetListingsResponse } from '@/features/types';
import { api } from './api';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<GetListingsResponse, void>({
      query: () => 'listings',
      providesTags: ['Listing'],
    }),
  }),
});

export const { useGetListingsQuery } = listingApi;
