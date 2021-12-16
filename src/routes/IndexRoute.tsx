import {NavigationContainer} from '@react-navigation/native';
import React, {FunctionComponent} from 'react';
import Check from '../screens/Check';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';
import {register} from 'react-native-bundle-splitter';
import HomeScreens from './HomeScreens';
import AuthRoute from './AuthRoute';
import NoNetwork from '../screens/NoNetwork';

enableScreens();

const ChangePasswordScreen = register({
  loader: () => import('../screens/ChangePasswordScreen'),
});
const Stack = createNativeStackNavigator();

const IndexRoute: FunctionComponent = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Check'}>
        <Stack.Screen
          name="NoNetwork"
          component={NoNetwork}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Check"
          component={Check}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={AuthRoute}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreens}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePass"
          component={ChangePasswordScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default IndexRoute;
