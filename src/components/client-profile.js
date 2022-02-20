import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {LoaderSpinner, CircularImage} from '.';
import {Rating} from 'react-native-ratings';

const ClientDetails = ({client_details, loadClient = false}) => {
  return (
    <View style={styles.container}>
      {loadClient ? (
        <>
          <LoaderSpinner.Wave height={150} width={150} />
          <Text style={{color: COLORS.secondary}}>
            Loading client info.....
          </Text>
        </>
      ) : (
        <>
          <CircularImage size={120} />
          <View style={styles._text_info}>
            <Text style={{...FONTS.body_medium}}>Client name</Text>
            <Text
              style={{
                ...FONTS.caption,
                marginVertical: SIZES.base,
                color: COLORS.secondary,
              }}>
              Company name
            </Text>
            <Text style={{...FONTS.body}}>Member for: 7 months</Text>
            {/* ==== rating section =========== */}
            <View style={styles._rating_section}>
              <Rating
                type="heart"
                ratingCount={5}
                imageSize={SIZES.padding_32}
                ratingColor={COLORS.secondary}
                startingValue={3}
                readonly={true}
              />
              {/* ===== stars  */}
              <View style={styles._rating_details}>
                <Text style={[styles._txt_sec]}>0 reviews</Text>
                <Text style={[styles._txt_sec]}>3 stars</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding_16,
    backgroundColor: COLORS.white,
  },
  _text_info: {
    marginTop: SIZES.padding_12,
    width: '100%',
    alignItems: 'center',
  },
  _rating_section: {
    marginVertical: SIZES.padding_12,
  },
  _rating_details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.base,
  },
  _txt_sec: {
    color: COLORS.secondary,
    ...FONTS.caption,
  },
});
export default ClientDetails;