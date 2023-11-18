import {applyMiddleware, compose} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';
import {persistReducer, persistStore} from 'redux-persist';
// import Reactotron from '../../reactotron.config';

const persistConfig = {
  key: 'root',
  blacklist: [],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  // enhancers: compose(applyMiddleware(thunk), Reactotron.createEnhancer()),
});

const persistor = persistStore(store);

const getPersistor = () => persistor;
const getStore = () => store;
const getState = () => {
  return store.getState();
};

export {getStore, getState, getPersistor};
