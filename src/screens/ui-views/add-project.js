import React, {useMemo, useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';
import {SIZES} from '../../constants/themes';

const CreateProject = ({sheetRef}) => {
  //bottom sheet
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => [0, '50%', '90%'], []);
  return (
    <BottomSheet
      style={styles.container}
      ref={sheetRef}
      initialSnapIndex={0}
      snapPoints={snapPoints}>
      <View style={styles._sheet_container}>
        <Text>Request Services</Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  _sheet_container: {
    padding: SIZES.base,
  },
});

export {CreateProject};
