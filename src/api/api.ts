import axios from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `JWT `,
  },
});

const BASE_URL = 'http://localhost:8001';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    getListings: builder.query<any[], void>({
      query: () => '/listings',
    }),
    getProfile: builder.query<any, void>({
      query: () => '/profile',
    }),
  }),
});

export default axiosInstance;

export const { useGetListingsQuery, useGetProfileQuery } = api;
