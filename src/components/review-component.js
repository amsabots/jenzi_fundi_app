import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LoaderSpinner, LoadingNothing} from '.';
import {COLORS, FONTS, SIZES} from '../constants/themes';

import {Card} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';

const ReviewItem = () => {
  return (
    <View style={styles._review_card}>
      <Text>i would recommend this service to anyone seeing this</Text>
      <Text style={{textAlign: 'right', ...FONTS.caption}}>2 months ago</Text>
    </View>
  );
};

const ReviewContainer = ({details, source = 'client'}) => {
  const [load, setload] = useState(false);
  const [review, setReviews] = useState([]);
  return (
    <View style={styles.container}>
      <LoaderSpinner.ArcherLoader loading={load} size={SIZES.size_48} />
      {load && <Text>Loading reviews, please wait...</Text>}
      {!load && (
        <View style={styles._reviews_wrapper}>
          <Text style={{...FONTS.body1, marginBottom: SIZES.padding_16}}>
            Reviews
          </Text>
          {review.length ? (
            <ReviewItem />
          ) : (
            <LoadingNothing label={'No reviews available'} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _reviews_wrapper: {
    width: '100%',
    flex: 1,
  },
  _review_card: {
    padding: SIZES.base,
    backgroundColor: COLORS.light_secondary,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
  },
});

export {ReviewContainer};
