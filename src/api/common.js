import {APIClient} from './client';

const ENDPOINTS = {
  BILLS: '/bills',
  FOOD_MENU:"/food-menus"
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

export const makeGetBillDetailsRequest = (id) => {
  return APIClient()
    .get(`${ENDPOINTS.BILLS}/${id}`)
    .then(res => res.data);
};