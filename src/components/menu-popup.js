import React from 'react';
import {Text} from 'react-native';

import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';

const MenuPopUp = ({options, onMenuSelect, menuTrigger}) => {
  return (
    <Menu>
      <MenuTrigger>{menuTrigger}</MenuTrigger>
      <MenuOptions>{options}</MenuOptions>
    </Menu>
  );
};

export {MenuPopUp};
