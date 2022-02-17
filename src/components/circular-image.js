import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {} from 'react-native-paper';

const CircularImage = ({size = 32, url}) => {
  return (
    <Image
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          resizeMode: 'cover',
        },
      ]}
      source={url || require('../assets/profile.png')}
    />
  );
};

const styles = StyleSheet.create({});

export {CircularImage};
