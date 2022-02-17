import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  HomeView,
  Projects,
  Profile,
  ChatScreen,
  payments,
  Logout,
} from '../screens';
import {screens} from '../constants/screens';
//navigation components
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// components
import {CustomDrawer} from '../components/custom-drawer';
//icons
import AntIcons from 'react-native-vector-icons/AntDesign';
import F5 from 'react-native-vector-icons/FontAwesome';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../constants/themes';

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={screens.home}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.light_secondary,
        drawerActiveTintColor: COLORS.secondary,
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name={screens.home}
        component={HomeView}
        options={{
          drawerIcon: ({color}) => (
            <AntIcons
              name="home"
              size={SIZES.icon_size_focused}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={screens.projects}
        component={Projects}
        options={{
          drawerIcon: ({color}) => (
            <F5 name="tasks" size={SIZES.icon_size_focused} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={screens.chats_screen}
        component={ChatScreen}
        options={{
          drawerIcon: ({color}) => (
            <AntIcons
              name="wechat"
              size={SIZES.icon_size_focused}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={screens.payments}
        component={payments}
        options={{
          drawerIcon: ({color}) => (
            <MIcons
              name="payments"
              size={SIZES.icon_size_focused}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppDrawerNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={screens.app_screen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screens.app_screen} component={DrawerNavigator} />
      <Stack.Screen name={screens.profile} component={Profile} />
      <Stack.Screen name={screens.logout} component={Logout} />
    </Stack.Navigator>
  );
};

export default AppDrawerNavigator;
