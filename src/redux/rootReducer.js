import {combineReducers} from 'redux';
import authReducer from './auth/auth.reducer';
import {tabsApi} from './tabs/api';

export default combineReducers({
  auth: authReducer,
  [tabsApi.reducerPath]: tabsApi.reducer,
});
