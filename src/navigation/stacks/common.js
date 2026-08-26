import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../../constants';
import { CreateInvoiceScreen, CreateMenuScreen } from '../../screens/common';
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
    </Stack.Navigator>
  );
};
