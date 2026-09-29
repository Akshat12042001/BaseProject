import {APIClient} from './client';

const ENDPOINTS={
    FORGOT_PASSWORD: '/auth/forgot-password',
    LOGIN: '/auth/login',
    REGISTER_HOST: '/auth/register/host',
    SEND_OTP_BY_EMAIL:"/users/send-otp-by-email",
    VERIFY_OTP_BY_EMAIL:"/users/verify/otp-by-email",
    ME:"/me",
    LOGOUT:"/auth/logout"
}

export const makeForgotPasswordRequest = data => {
    return APIClient()
      .post(ENDPOINTS.FORGOT_PASSWORD, data)
      .then(res => res.data);
  };

export const makeLoginRequest = data => {
    return APIClient()
      .post(ENDPOINTS.LOGIN, data)
      .then(res => res.data);
  };

export const makeRegisterHostRequest = data => {
    return APIClient()
      .post(ENDPOINTS.REGISTER_HOST, data)
      .then(res => res.data);
  };

export const makeSendHostRegistrationOtpRequest = userId => {
    return APIClient()
      .post(`${ENDPOINTS.REGISTER_HOST}/${userId}/send-otp`)
      .then(res => res.data);
  };

export const makeVerifyHostRegistrationOtpRequest = (userId, data) => {
    return APIClient()
      .post(`${ENDPOINTS.REGISTER_HOST}/${userId}/verify`, data)
      .then(res => res.data);
  };

export const makeSendOtpByEmailRequest = data => {
    return APIClient()
      .post(ENDPOINTS.SEND_OTP_BY_EMAIL, data)
      .then(res => res.data);
  };

export const makeVerifyOtpByEmailRequest = data => {
    return APIClient()
      .post(ENDPOINTS.VERIFY_OTP_BY_EMAIL, data)
      .then(res => res.data);
  };

export const makeMeRequest = () => {
    return APIClient()
      .get(ENDPOINTS.ME)
      .then(res => res.data);
  };

export const makeLogoutRequest = () => {
    return APIClient()
      .post(ENDPOINTS.LOGOUT)
      .then(res => res.data);
  };