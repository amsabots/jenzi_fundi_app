import React, {useState, useEffect, useRef, useMemo, memo} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, StyleSheet, FlatList} from 'react-native';
import {SIZES} from '../constants/themes';

const ReviewItem = ({item}) => {
  return (
    <View>
      <Text>Review one</Text>
    </View>
  );
};

const Reviews = ({reviews, bottomSheetRef, headerText = 'Reviews'}) => {
  // variables
  const snapPoints = useMemo(() => [0, '50%', '90%'], []);

  return (
    <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        <ReviewItem />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SIZES.padding_16,
  },
});

export default memo(Reviews);
