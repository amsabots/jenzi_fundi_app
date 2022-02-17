import React from 'react';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';

const PrimaryStatusBar = () => {
  const {translucent, bg_color} = useSelector(state => state.ui_settings);
  return <StatusBar translucent={translucent} backgroundColor={bg_color} />;
};

export {PrimaryStatusBar};
