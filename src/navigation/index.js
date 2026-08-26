import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStack from './stacks/authentication';
import {NavigationService} from '../services';
import {createStackNavigator} from '@react-navigation/stack';
import config from './config';
import {NAVIGATION} from '../constants';
import BottomTabs from './bottomTabs';
import { useSelector } from 'react-redux';
import CommonStack from './stacks/common';

const Stack = createStackNavigator();

const setNavigatorRef = ref => NavigationService.setNavigatorRef(ref);

const AppNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return(
    <NavigationContainer ref={setNavigatorRef}>
    <Stack.Navigator screenOptions={config}>
      {isLoggedIn ? (
        <>
        <Stack.Screen name={NAVIGATION.STACKS.TABS} component={BottomTabs} />
        <Stack.Screen name={NAVIGATION.STACKS.COMMON} component={CommonStack} />
        </>
      ) : (
        <Stack.Screen name={NAVIGATION.STACKS.AUTH} component={AuthenticationStack} />
      )}
    </Stack.Navigator>
  </NavigationContainer>
);
}
  

export default AppNavigator;
