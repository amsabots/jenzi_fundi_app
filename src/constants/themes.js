import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

/**
 * Main application colors and themeing shades
 */
export const COLORS = {
  //base colors
  primary: '#09152B',
  secondary: '#F05636',
  primaryDark: '#09152B',
  info: '#56B653',
  info_light: '#F0563610',
  light_green: '#56B65315',
  danger: '#F23C3D',
  transparent: '#ffffff00',
  blue_deep: '#5e69f7',

  light_secondary: '#F0563630',
  light_bluish: '#5e69f730',
  light_greenish: '#56B65330',

  //common utilities
  white: '#FFFFFF',
  black: '#1E1F20',

  //utilities extra shade
  disabled_grey: '#E4E6E8',
  grey_dark: '#8a8a8a',
};

export const SIZES = {
  base: 8,
  padding_16: 16,
  padding_4: 4,
  icon_size: 20,
  icon_size_focused: 25,
  stroke: 1,
  padding_12: 12,
  padding_32: 32,
  size_48: 48,
  size_64: 64,
  size_96: 96,
  icon_Label: 10,

  device: {
    width,
    height,
  },

  centerInView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  //font sizes
};

const fontSizes = {
  caption: 12,
  body: 14,
  h6: 20,
  h5: 24,
  h4: 32,
  h3: 48,
  h2: 60,
  h1: 96,
};

export const FONTS = {
  h1: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.h1},
  h2: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.h2},
  h3: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.h3},
  h4: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.h4},
  h5: {fontFamily: 'Roboto-Regular', fontSize: fontSizes.h5},
  h6: {fontFamily: 'Roboto-Medium', fontSize: fontSizes.h6},
  h6: {fontFamily: 'Roboto-Regular', fontSize: fontSizes.h6},

  body: {fontFamily: 'Roboto-Regular', fontSize: fontSizes.body},
  body_medium: {fontFamily: 'Roboto-Medium', fontSize: fontSizes.body},
  body_bold: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.body},
  body_light: {fontFamily: 'Roboto-Light', fontSize: fontSizes.body},

  body1: {fontFamily: 'Roboto-Medium', fontSize: SIZES.padding_16},

  caption: {fontFamily: 'Roboto-Regular', fontSize: fontSizes.caption},
  captionBold: {fontFamily: 'Roboto-Bold', fontSize: fontSizes.caption},
};

export const UTILS = {
  svgPath:
    'M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z',
};
