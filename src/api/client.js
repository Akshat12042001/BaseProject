import axios from 'axios';
import Config from 'react-native-config';
import {getState, getStore} from '../redux';
import { reset } from '../redux/auth/auth.reducer';
import { errorToast } from '../utils/alerts';

const defaultOptions = (token = '') => {
  const authState = getState()?.auth?.user || {};
  const tokenToUse = token || authState.accessToken || '';
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json',
      authorization: !!tokenToUse ? `Bearer ${tokenToUse}` : '',
      // 'lan': language,
    },
  };
};

export const APIClient = (token = '') => {
  //   const t = useTranslation();
  const apiClient = axios.create({
    baseURL: Config.API_URL,
    timeout: 10000,
    ...defaultOptions(token),
  });

  apiClient.interceptors.request.use(async config => {
    return config;
  });
  apiClient.interceptors.response.use(
    response => {
      return response;
    },
    async function (error) {
      if (
        error?.response?.data?.message &&
        error?.response?.data?.message !== 'canceled'
      ) {
        errorToast(error.response.data.message);
      }


      if (error?.response?.status === 401) {
        setTimeout(() => {
          getStore()?.dispatch(reset());
        }, 1000);
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};
