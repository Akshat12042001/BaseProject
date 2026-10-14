import {APIClient} from './client';

const ENDPOINTS = {
  BILLS: '/bills',
  FOOD_MENU: '/food-menus',
  UPLOAD_LOGO: '/gemini/upload',
  GENERATE_LOGO: '/gemini/generate',
  UPDATE_GENERATED_LOGO: '/gemini/update/generated/logo',
  CANCELLATION_POLICIES: '/homestays/cancellation-policies',
  HOST_LISTING_DETAIL: '/homestays/host/listings',
  HOMESTAY: '/homestays',
  HOST_LISTINGS_DROPDOWN: '/homestays/host/listings/dropdown',
  REVIEWS: '/reviews',
  HOST_PENDING_REVIEWS: '/reviews/host/pending',
  HOMESTAY_BOOKING_CALENDAR: '/bookings/homestays',
  DIRECT_BOOKING_BY_HOST: '/deals/direct-booking/by/host',
  HOST_DIRECT_BOOKINGS: '/deals/host/direct-bookings',
  HOST_BOOKINGS: '/deals/host/bookings',
  DEAL_PREVIEW: '/deals',
  NOTIFICATIONS: '/notification',
  AMENITIES: '/homestays/amenities/all',
  STATES: '/locations/states',
  REWARDS: '/points/me/transactions',
  REWARDS_SUMMARY: '/points/me',
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

export const makeGetRewardsRequest = data => {
  return APIClient()
    .get(ENDPOINTS.REWARDS, {params: data})
    .then(res => res.data);
};

export const makeGetRewardsSummaryRequest = () => {
  return APIClient()
    .get(ENDPOINTS.REWARDS_SUMMARY)
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

export const makeUpdateBillStatusRequest = id => {
  return APIClient()
    .put(`${ENDPOINTS.BILLS}/status/${id}`)
    .then(res => res.data);
};

export const makeDeleteBillRequest = id => {
  return APIClient()
    .delete(`${ENDPOINTS.BILLS}/${id}`)
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

export const makeUpdateFoodMenuActiveRequest = (id, isActive) => {
  return APIClient()
    .patch(`${ENDPOINTS.FOOD_MENU}/${id}/active`, {isActive: Boolean(isActive)})
    .then(res => res.data);
};

export const makeDeleteFoodMenuRequest = id => {
  return APIClient()
    .delete(`${ENDPOINTS.FOOD_MENU}/${id}`)
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

export const makeCreateHomestayRequest = data => {
  return APIClient()
    .post(ENDPOINTS.HOMESTAY, data)
    .then(res => res.data);
};

export const makeUpdateHomestayRequest = (id, data) => {
  return APIClient()
    .put(`${ENDPOINTS.HOMESTAY}/${id}`, data)
    .then(res => res.data);
};

export const makeDeleteHomestayRequest = id => {
  return APIClient()
    .delete(`${ENDPOINTS.HOMESTAY}/${id}`)
    .then(res => res.data);
};

export const makeDeleteHomestayImageRequest = (homestayId, imageId) => {
  return APIClient()
    .delete(`${ENDPOINTS.HOMESTAY}/${homestayId}/images/${imageId}`)
    .then(res => res.data);
};

const imageFileName = file => {
  const type = file?.type || 'image/jpeg';
  const extension = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1] || 'jpg';
  const name = file?.name || `photo.${extension}`;

  if (/\.[a-zA-Z0-9]+$/.test(name)) {
    return name;
  }

  return `${name}.${extension}`;
};

export const makeUploadHomestayImagesRequest = (homestayId, files) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('images', {
      uri: file.uri,
      name: imageFileName(file),
      type: file.type || 'image/jpeg',
    });
  });

  return APIClient()
    .post(`${ENDPOINTS.HOMESTAY}/${homestayId}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    })
    .then(res => res.data);
};

export const makeGetStatesRequest = () => {
  return APIClient()
    .get(ENDPOINTS.STATES)
    .then(res => res.data);
};

export const makeGetStateCitiesRequest = stateId => {
  return APIClient()
    .get(`${ENDPOINTS.STATES}/${stateId}/cities`)
    .then(res => res.data);
};

export const makeGetAmenitiesRequest = () => {
  return APIClient()
    .get(ENDPOINTS.AMENITIES)
    .then(res => res.data);
};

export const makeGetCancellationPoliciesRequest = () => {
  return APIClient()
    .get(ENDPOINTS.CANCELLATION_POLICIES)
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

export const makeGetHomestayBlockedDatesRequest = homestayId => {
  return APIClient()
    .get(`${ENDPOINTS.HOMESTAY_BOOKING_CALENDAR}/${homestayId}/blocked-dates`)
    .then(res => res.data);
};

export const makeCreateDirectBookingRequest = data => {
  return APIClient()
    .post(ENDPOINTS.DIRECT_BOOKING_BY_HOST, data)
    .then(res => res.data);
};

export const makeGetHostDirectBookingsRequest = params => {
  return APIClient()
    .get(ENDPOINTS.HOST_DIRECT_BOOKINGS, {params})
    .then(res => res.data);
};

export const makeDeleteHostBookingRequest = bookingId => {
  return APIClient()
    .delete(`${ENDPOINTS.HOST_BOOKINGS}/${bookingId}`)
    .then(res => res.data);
};

export const makeUpdateHostBookingRequest = (bookingId, data) => {
  return APIClient()
    .patch(`${ENDPOINTS.HOST_BOOKINGS}/${bookingId}`, data)
    .then(res => res.data);
};

export const makeMarkNotificationReadRequest = notificationId => {
  return APIClient()
    .put(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}`)
    .then(res => res.data);
};

export const makeGetBookingPreviewRequest = bookingId => {
  return APIClient()
    .get(`${ENDPOINTS.DEAL_PREVIEW}/${bookingId}/preview`)
    .then(res => res.data);
};