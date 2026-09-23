import {APIClient} from './client';

const ENDPOINTS = {
  BILLS: '/bills',
  FOOD_MENU: '/food-menus',
  UPLOAD_LOGO: '/gemini/upload',
  GENERATE_LOGO: '/gemini/generate',
  UPDATE_GENERATED_LOGO: '/gemini/update/generated/logo',
  HOST_LISTING_DETAIL: '/homestays/host/listings',
  HOST_LISTINGS_DROPDOWN: '/homestays/host/listings/dropdown',
  REVIEWS: '/reviews',
  HOST_PENDING_REVIEWS: '/reviews/host/pending',
  HOMESTAY_BOOKING_CALENDAR: '/bookings/homestays',
  DIRECT_BOOKING_BY_HOST: '/deals/direct-booking/by/host',
};


const getLogoFileName = file => {
  if (file?.name && /\.[a-zA-Z0-9]+$/.test(file.name)) {
    return file.name;
  }

  const mimeType = file?.type || 'image/jpeg';
  const extension = mimeType.split('/')[1] || 'jpg';

  return extension === 'jpeg' ? 'logo.jpg' : `logo.${extension}`;
};

export const makeGenerateLogoRequest = data => {
  return APIClient()
    .post(ENDPOINTS.GENERATE_LOGO, data)
    .then(res => res.data);
};

export const makeUpdateGeneratedLogoRequest = data => {
  return APIClient()
    .post(ENDPOINTS.UPDATE_GENERATED_LOGO, data)
    .then(res => res.data);
};

export const makeUploadLogoRequest = file => {
  const formData = new FormData();

  formData.append('logo', {
    uri: file.uri,
    name: getLogoFileName(file),
    type: file.type || 'image/jpeg',
  });

  return APIClient()
    .post(ENDPOINTS.UPLOAD_LOGO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => res.data);
};

export const makeGetReviewsRequest = data => {
  return APIClient()
    .get(ENDPOINTS.REVIEWS, {params: data})
    .then(res => res.data);
};

export const makeGetHostPendingReviewsRequest = data => {
  return APIClient()
    .get(ENDPOINTS.HOST_PENDING_REVIEWS, {params: data})
    .then(res => res.data);
};

export const makeGetBillsRequest = (data) => {
  return APIClient()
    .get(ENDPOINTS.BILLS, {params: data})
    .then(res => res.data);
};

export const makeCreateBillRequest = data => {
  return APIClient()
    .post(ENDPOINTS.BILLS, data)
    .then(res => res.data);
};

export const makeUpdateBillRequest = (id, data) => {
  return APIClient()
    .put(`${ENDPOINTS.BILLS}/${id}`, data)
    .then(res => res.data);
};

export const makeGetSingleFoodMenuRequest = (id) => {
  return APIClient()
    .get(`${ENDPOINTS.FOOD_MENU}/${id}`)
    .then(res => res.data);
};

export const makeUpdateFoodMenuRequest = (id, data) => {
  return APIClient()
    .patch(`${ENDPOINTS.FOOD_MENU}/${id}`, data)
    .then(res => res.data);
};

export const makeCreateFoodMenuRequest = data => {
  return APIClient()
    .post(ENDPOINTS.FOOD_MENU, data)
    .then(res => res.data);
};

export const makeFoodMenuPdfRequest = data => {
  return APIClient()
    .post(`${ENDPOINTS.FOOD_MENU}/pdf`, data, {
      responseType: 'arraybuffer',
    })
    .then(res => res.data);
};

export const makeGetFoodMenuRequest = (data) => {
  return APIClient()
    .get(ENDPOINTS.FOOD_MENU, {params: data})
    .then(res => res.data);
};

export const makeGetFoodMenuBillItemsRequest = () => {
  return APIClient()
    .get(`${ENDPOINTS.FOOD_MENU}/bill-items`)
    .then(res => res.data);
};

export const makeGetBillDetailsRequest = (id) => {
  return APIClient()
    .get(`${ENDPOINTS.BILLS}/${id}`)
    .then(res => res.data);
};

export const makeGetPropertyDetailRequest = id => {
  return APIClient()
    .get(`${ENDPOINTS.HOST_LISTING_DETAIL}/${id}`)
    .then(res => res.data);
};

export const makeGetHostListingsDropdownRequest = params => {
  return APIClient()
    .get(ENDPOINTS.HOST_LISTINGS_DROPDOWN, {params})
    .then(res => res.data);
};

export const makeGetHomestayCalendarRequest = (homestayId, params) => {
  return APIClient()
    .get(`${ENDPOINTS.HOMESTAY_BOOKING_CALENDAR}/${homestayId}/calendar`, {
      params,
    })
    .then(res => res.data);
};

export const makeCreateDirectBookingRequest = data => {
  return APIClient()
    .post(ENDPOINTS.DIRECT_BOOKING_BY_HOST, data)
    .then(res => res.data);
};