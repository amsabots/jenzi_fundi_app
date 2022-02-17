import React from 'react';
import {StyleSheet, View} from 'react-native';
//
import SplashScreen from 'react-native-splash-screen';

import {Provider} from 'react-redux';
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
import {PrimaryStatusBar} from './src/components';

//stack screen
import {NavigationContainerWrapper} from './src/navigation';
import {screens, theme} from './src/constants';

// app theme - colors and fonts
const appTheme = {
  ...DefaultTheme,
  color: {
    ...DefaultTheme.colors,
    primary: theme.COLORS.primary,
    accent: theme.COLORS.secondary,
  },
};
const delay = duration => {
  return new Promise(res => setTimeout(res, duration));
};

const App = () => {
  const [splashDone, setSplashDone] = React.useState(false);

  React.useEffect(() => {
    delay(3000).then(e => SplashScreen.hide());
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
      </Provider>
      <Toast />
    </>
  );
};

export default App;
