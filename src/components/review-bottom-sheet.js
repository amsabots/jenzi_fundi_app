import React, {useState, useEffect, useRef, useMemo, memo} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

const ReviewItem = ({item}) => {
  return (
    <View style={styles._review_card}>
      <Text>i would recommend this service to anyone seeing this</Text>
      <Text style={{textAlign: 'right', ...FONTS.caption}}>2 months ago</Text>
      <Divider style={{marginVertical: SIZES.base}} />
    </View>
  );
};

const Reviews = ({reviews, bottomSheetRef, headerText = 'Reviews'}) => {
  // variables
  const snapPoints = useMemo(() => [0, '35%', '70%'], []);

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {[...Array(20).keys()].map((e, idx) => (
          <ReviewItem key={idx} />
        ))}
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SIZES.padding_16,
  },
  _review_card: {},
});

export default memo(Reviews);
