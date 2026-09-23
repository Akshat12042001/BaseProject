import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../../constants';
import { CreateInvoiceScreen, CreateMenuScreen, CreateLogoScreen, PropertyDetailScreen, CreateBookingScreen } from '../../screens/common';
import config from '../config';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={config}>
      <Stack.Screen
        name={NAVIGATION.COMMON.CREATE_INVOICE_SCREEN}
        component={CreateInvoiceScreen}
      />
      <Stack.Screen
        name={NAVIGATION.COMMON.CREATE_MENU_SCREEN}
        component={CreateMenuScreen}
      />
      <Stack.Screen
        name={NAVIGATION.COMMON.CREATE_LOGO_SCREEN}
        component={CreateLogoScreen}
      />
      <Stack.Screen
        name={NAVIGATION.COMMON.PROPERTY_DETAIL_SCREEN}
        component={PropertyDetailScreen}
      />
      <Stack.Screen
        name={NAVIGATION.COMMON.CREATE_BOOKING_SCREEN}
        component={CreateBookingScreen}
      />
    </Stack.Navigator>
  );
};
