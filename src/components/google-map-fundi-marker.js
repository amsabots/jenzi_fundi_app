import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CircularImage} from '.';
import {COLORS, SIZES} from '../constants/themes';

const MapMarker = ({
  pointerColor = COLORS.secondary,
  size = SIZES.padding_12,
  avatar_size = SIZES.padding_32,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles._avatar_border,
          {
            borderRadius: avatar_size / 2 + 6,
            ...SIZES.centerInView,
            borderColor: pointerColor,
          },
        ]}>
        <CircularImage size={avatar_size} />
      </View>
      <View
        style={[
          styles._triangle_pointer,
          {
            borderTopColor: pointerColor,
            borderTopWidth: size,
            borderLeftWidth: size,
            borderRightWidth: size,
          },
        ]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding_4,
  },
  _triangle_pointer: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -4,
  },
  _avatar_border: {
    borderWidth: SIZES.padding_4,
    padding: 1,
  },
});
export {MapMarker};
