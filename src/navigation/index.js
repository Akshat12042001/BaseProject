import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStack from './stacks/authentication';
import {NavigationService} from '../services';
import {createStackNavigator} from '@react-navigation/stack';
import config from './config';

const Stack = createStackNavigator();

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer ref={ref => NavigationService.setNavigatorRef(ref)}>
        <Stack.Navigator screenOptions={config}>
          <Stack.Screen name="Auth" component={AuthenticationStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
