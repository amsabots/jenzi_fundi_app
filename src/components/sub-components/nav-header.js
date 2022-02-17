import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

import {Button, useTheme} from 'react-native-paper';
import {screens, theme} from '../../constants';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
//
import {Chip} from 'react-native-paper';

//
import {CircularImage} from '../circular-image';

//redux
import {connect} from 'react-redux';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const NavHeaderView = ({navigation, user_data}) => {
  const {colors} = useTheme();

  const navigateToRoute = () => {
    navigation.closeDrawer();
    navigation.navigate(screens.profile);
  };
  return (
    <View style={[styles.container]}>
      <CircularImage size={100} />
      <Text style={[styles.color, styles.txt1]}>{user_data.user.name}</Text>
      {/*  */}
      <Text style={[styles.color, styles._email]}>{user_data.user.email}</Text>

      <Button
        mode="contained"
        style={{marginTop: SIZES.padding_16, backgroundColor: COLORS.secondary}}
        icon={'face-profile'}
        onPress={() => navigateToRoute()}>
        Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.SIZES.padding_16,
  },
  color: {},
  txt1: {
    ...FONTS.body_bold,
    marginTop: SIZES.padding_12,
  },
  _info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  _email: {
    ...FONTS.body,
  },
});

export const NavHeader = connect(stateToProps)(NavHeaderView);
