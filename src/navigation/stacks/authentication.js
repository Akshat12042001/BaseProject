import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../../constants';
import { LoginScreen, ForgotPasswordScreen} from '../../screens/authentication';
import config from '../config';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={config}>
      <Stack.Screen
        name={NAVIGATION.AUTH.LOGIN_SCREEN}
        component={LoginScreen}
      />
      <Stack.Screen
        name={NAVIGATION.AUTH.FORGOT_PASSWORD_SCREEN}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
