import React, {useEffect} from 'react';
//sqlite
import storage from '@react-native-async-storage/async-storage';

import AuthNavigator from './auth-stack';
import AppDrawerNavigator from './app-stack';
import {offline_data, screens} from '../constants';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//components
import {MainActivity} from '../screens';

//redux
import {useDispatch, connect} from 'react-redux';
import {user_data_actions} from '../store-actions';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const Stack = createNativeStackNavigator();

const NavigationContainerWrapperView = () => {
  // const dispatch = useDispatch();
  // const user_exists = () => {
  //   if (!user_data.user) return false;
  //   return Object.keys(user_data.user).length > 0;
  // };
  // useEffect(() => {
  //   storage
  //     .getItem(offline_data.user)
  //     .then(d => {
  //       dispatch(user_data_actions.create_user(JSON.parse(d)));
  //     })
  //     .catch(err => dispatch(user_data_actions.delete_user()));
  // }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={screens.main_activity}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={screens.stack_app} component={AppDrawerNavigator} />
        <Stack.Screen name={screens.main_activity} component={MainActivity} />
        <Stack.Screen name={screens.stack_auth} component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const NavigationContainerWrapper = connect(mapStateToProps)(
  NavigationContainerWrapperView,
);
