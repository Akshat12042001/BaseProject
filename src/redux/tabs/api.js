import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

const ENDPOINTS = {
  DASHBOARD: '/dashboard/host',
  BILLS: '/bills',
  MY_PROPERTIES: '/homestays/host/my-listings',
  FOOD_MENU:"/food-menus"
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
      getFoodMenu: builder.query({
        query: (data) => ({
          url: ENDPOINTS.FOOD_MENU,
          method: 'GET',
          params: data,
        }),
      }),
    }),
  });

  export const {useGetDashboardQuery, useGetBillsQuery, useGetMyPropertiesQuery, useGetFoodMenuQuery} = tabsApi;