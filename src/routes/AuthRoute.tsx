import React from 'react';
import SignIn from '../screens/SignInScreen';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {register} from 'react-native-bundle-splitter';

const ForgetPass = register({
  loader: () => import('../screens/ForgetPassScreen'),
});

const Stack = createNativeStackNavigator();
function AuthRoute({navigation}: any) {
  return (
    <Stack.Navigator initialRouteName={'SignIn'}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgetPass"
        component={ForgetPass}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AuthRoute;
