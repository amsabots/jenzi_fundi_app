import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper';

import {LoaderSpinner, LoadingNothing, DefaultToolBar} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';

const ReviewItem = ({review}) => {
  const {review: text, createdAt} = review;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => onLonpressListener(review)}>
      <Text>{text}</Text>
      <View
        style={{
          marginTop: SIZES.base,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{...FONTS.caption, color: COLORS.green}}>
          {moment(createdAt).fromNow()}
        </Text>
        {/* <Text style={{...FONTS.caption, color: COLORS.blue_deep}}>
          by anonymous
        </Text> */}
      </View>
      <Divider
        style={{marginTop: SIZES.base, marginBottom: SIZES.padding_16}}
      />
    </TouchableOpacity>
  );
};

const FundiReviews = ({navigation, route}) => {
  const {reviews} = route.params;
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
            style={{paddingVertical: SIZES.base}}
            data={reviews}
            keyExtractor={(item, idx) => idx}
            renderItem={({item}) => <ReviewItem review={item} />}
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
