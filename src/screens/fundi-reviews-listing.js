import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';

import {LoaderSpinner, LoadingNothing, DefaultToolBar} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {ReviewItem} from './rate-client';

const FundiReviews = ({navigation}) => {
  const [reviews, setReviews] = useState([]);
  const [load, setLoad] = useState(false);

  if (load) {
    return (
      <View style={{...SIZES.centerInView}}>
        <LoaderSpinner.Wave height={200} width={200} />
        <Text style={{...FONTS.captionBold, color: COLORS.blue_deep}}>
          Getting reviews.......
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title={'Your reviews'} />
      <View style={styles._container}>
        {!reviews.length ? (
          <View style={{...SIZES.centerInView}}>
            <LoadingNothing
              height={150}
              width={SIZES.device.width - 100}
              label={
                'You zero reviews at this moment. You can always tell your client to review your account upn project completion'
              }
            />
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item, idx) => idx}
            renderItem={({item}) => <ReviewItem />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _container: {
    flex: 1,
    paddingTop: SIZES.base,
    paddingHorizontal: SIZES.padding_16,
  },
});

export default FundiReviews;
