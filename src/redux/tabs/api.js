import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

const ENDPOINTS = {
  DASHBOARD: '/dashboard/host',
  BILLS: '/bills',
  MY_PROPERTIES: '/homestays/host/my-listings',
  HOST_LISTING_DETAIL: '/homestays/host/listings',
  REVIEWS: '/reviews',
  HOST_PENDING_REVIEWS: '/reviews/host/pending',
  FOOD_MENU: '/food-menus',
  HOST_DIRECT_BOOKINGS: '/deals/host/direct-bookings',
};


const baseQuery = fetchBaseQuery({
    baseUrl: Config.API_URL,
    prepareHeaders: (headers, {getState}) => {
      const token = getState()?.auth?.user?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  export const tabsApi = createApi({
    reducerPath: 'tabsApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
      getDashboard: builder.query({
        query: () => ENDPOINTS.DASHBOARD,
      }),
      getBills: builder.query({
        query: (data) => ({
          url: ENDPOINTS.BILLS,
          method: 'GET',
          params: data,
        }),
        serializeQueryArgs: ({endpointName}) => endpointName,
        merge: (currentCache, newResponse, {arg}) => {
          if (arg.page === 1) {
            return newResponse;
          }

          const existingIds = new Set(
            currentCache.data.map(invoice => invoice.id),
          );
          const nextInvoices = newResponse.data.filter(
            invoice => !existingIds.has(invoice.id),
          );

          currentCache.data.push(...nextInvoices);
          currentCache.meta = newResponse.meta;
          currentCache.stats = newResponse.stats;
          currentCache.message = newResponse.message;
          currentCache.status = newResponse.status;
          currentCache.success = newResponse.success;
        },
        forceRefetch: ({currentArg, previousArg}) =>
          currentArg?.page !== previousArg?.page ||
          currentArg?.limit !== previousArg?.limit,
      }),
      getMyProperties: builder.query({
        query: (data) => ({
          url: ENDPOINTS.MY_PROPERTIES,
          method: 'GET',
          params: data,
        }),
      }),
      getPropertyDetail: builder.query({
        query: id => ({
          url: `${ENDPOINTS.HOST_LISTING_DETAIL}/${id}`,
          method: 'GET',
        }),
      }),
      getPropertyReviews: builder.query({
        query: params => ({
          url: ENDPOINTS.REVIEWS,
          method: 'GET',
          params,
        }),
      }),
      getHostPendingReviews: builder.query({
        query: params => ({
          url: ENDPOINTS.HOST_PENDING_REVIEWS,
          method: 'GET',
          params,
        }),
      }),
      getFoodMenu: builder.query({
        query: (data) => ({
          url: ENDPOINTS.FOOD_MENU,
          method: 'GET',
          params: data,
        }),
      }),
      getHostDirectBookings: builder.query({
        query: data => ({
          url: ENDPOINTS.HOST_DIRECT_BOOKINGS,
          method: 'GET',
          params: data,
        }),
        serializeQueryArgs: ({endpointName}) => endpointName,
        merge: (currentCache, newResponse, {arg}) => {
          if (arg.page === 1) {
            return newResponse;
          }

          const existingIds = new Set(
            currentCache.data.map(booking => booking.id),
          );
          const nextBookings = newResponse.data.filter(
            booking => !existingIds.has(booking.id),
          );

          currentCache.data.push(...nextBookings);
          currentCache.meta = newResponse.meta;
        },
        forceRefetch: ({currentArg, previousArg}) =>
          currentArg?.page !== previousArg?.page ||
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.search !== previousArg?.search ||
          currentArg?.checkInFrom !== previousArg?.checkInFrom ||
          currentArg?.checkOutFrom !== previousArg?.checkOutFrom ||
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.sortOrder !== previousArg?.sortOrder,
      }),
    }),
  });

  export const {
    useGetDashboardQuery,
    useGetBillsQuery,
    useGetMyPropertiesQuery,
    useGetPropertyDetailQuery,
    useGetPropertyReviewsQuery,
    useGetHostPendingReviewsQuery,
    useGetFoodMenuQuery,
    useGetHostDirectBookingsQuery,
  } = tabsApi;