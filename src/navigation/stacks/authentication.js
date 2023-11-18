import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NAVIGATION} from '../../constants';
import {WelcomeScreen} from '../../screens/authentication';
import config from '../config';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={config}>
      <Stack.Screen
        name={NAVIGATION.AUTH.WELCOME_SCREEN}
        component={WelcomeScreen}
      />
    </Stack.Navigator>
  );
};
