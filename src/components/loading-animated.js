import React from 'react';
import LottieView from 'lottie-react-native';

import {StyleSheet, View, Text} from 'react-native';
import {FONTS, SIZES} from '../constants/themes';

const VinyLoader = ({size = 32, loading = false}) => {
  if (loading)
    return (
      <LottieView
        source={require('../animations_files/vinyl_loading.json')}
        autoPlay
        loop
        style={[styles.vl_container, {height: size, width: size}]}
      />
    );
  return null;
};

const RingedLoader = ({size = 32, loading = false}) => {
  if (loading)
    return (
      <LottieView
        source={require('../animations_files/dotted_rings.json')}
        autoPlay
        loop
        style={[styles.vl_container, {height: size, width: size}]}
      />
    );
  return null;
};

const ArcherLoader = ({
  size = 32,
  loading = false,
  colorStart = 'black',
  colorFinal = 'red',
}) => {
  if (loading)
    return (
      <LottieView
        source={require('../animations_files/archer_target.json')}
        autoPlay
        loop
        colorFilters={[
          {
            keypath: 'Layer 1/Target Outlines 2',
            color: colorFinal,
          },
          {keypath: 'Layer 1/Target Outlines', color: colorStart},
        ]}
        style={[styles.vl_container, {height: size, width: size}]}
      />
    );
  return null;
};

const DoubleRing = ({
  size = 32,
  loading = false,
  innerLayer = 'red',
  outerLayer = 'black',
  label = null,
}) => {
  if (loading)
    return (
      <View style={styles.vl_container}>
        <LottieView
          source={require('../animations_files/double_rings.json')}
          autoPlay
          loop
          colorFilters={[
            {
              keypath: 'シェイプレイヤー 1',
              color: innerLayer,
            },
            {keypath: 'シェイプレイヤー 2', color: outerLayer},
          ]}
          style={[styles.vl_container, {height: size, width: size}]}
        />
        {label && (
          <Text style={{...FONTS.body_medium, marginLeft: SIZES.base}}>
            {label}
          </Text>
        )}
      </View>
    );
  return null;
};

const MainScreen = ({height = 32, width = 32, loading = false}) => {
  if (loading)
    return (
      <LottieView
        source={require('../animations_files/men_working.json')}
        autoPlay
        loop
        style={[styles.vl_container, {height, width}]}
      />
    );
  return null;
};

const styles = StyleSheet.create({
  vl_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export {VinyLoader, RingedLoader, ArcherLoader, DoubleRing, MainScreen};
