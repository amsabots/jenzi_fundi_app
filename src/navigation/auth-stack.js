import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import {Login, Register, ResetPass} from '../screens';
import {screens} from '../constants/screens';

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={screens.login}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screens.login} component={Login} />
      <Stack.Screen name={screens.register} component={Register} />
      <Stack.Screen name={screens.reset_pass} component={ResetPass} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
