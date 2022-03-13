import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
//
import SplashScreen from 'react-native-splash-screen';

import {connect, Provider} from 'react-redux';
import {createStore} from 'redux';
//paper react native ui lib
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
//menu provider
import {MenuProvider} from 'react-native-popup-menu';
//navigation

import {allReducers} from './store';

export const store = createStore(allReducers);

// ui components
import {PrimaryStatusBar, SnackView} from './src/components';

//stack screen
import {NavigationContainerWrapper} from './src/navigation';
import {theme} from './src/constants';
import {PostActionRunner} from './src/constants/themes';

// app theme - colors and fonts

const App = () => {
  const appTheme = {
    ...DefaultTheme,
    color: {
      ...DefaultTheme.colors,
      primary: theme.COLORS.primary,
      accent: theme.COLORS.secondary,
    },
  };

  useEffect(() => {
    console.log('running entry point');
  }, []);
  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={appTheme}>
          <MenuProvider>
            <PrimaryStatusBar />
            <NavigationContainerWrapper />
          </MenuProvider>
        </PaperProvider>
        <SnackView />
      </Provider>
      <Toast />
    </>
  );
};

export default App;
