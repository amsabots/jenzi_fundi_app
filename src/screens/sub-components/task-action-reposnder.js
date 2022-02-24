import React, {useState, useEffect, useMemo, memo} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import {COLORS, FONTS, SIZES} from '../../constants/themes';

//redux
import {useDispatch} from 'react-redux';

const ProjectCancelOrDispute = ({
  sheetRef,
  type,
  job_item,
  on_submit,
  dismissListener,
}) => {
  const [reason, setReason] = useState('');
  const [load, setLoad] = useState(false);
  const snapPoints = useMemo(() => [0, '50%', '70%']);

  const handleReasonSubmit = () => {
    if (!reason || reason.length < 10)
      return ToastAndroid.show(
        'Please provide a valid reason for requesting the action',
        ToastAndroid.SHORT,
      );
    setLoad(true);

    //update the job item
  };
  return (
    <BottomSheet
      snapPoints={snapPoints}
      index={0}
      ref={sheetRef}
      style={styles.container}>
      <Text style={{...FONTS.body_medium}}>
        {type === 'DISPUTE'
          ? 'Why are do you want to raise a dispute on this project'
          : 'Why do you want to cancel this project'}{' '}
        <Text style={{color: COLORS.secondary}}>*</Text>
      </Text>

      <TextInput
        placeholder="Attach the reason for project cancellation"
        mode="outlined"
        dense={true}
        style={{marginTop: SIZES.padding_12}}
        onChangeText={txt => setReason(txt)}
        multiline={true}
        numberOfLines={3}
      />
      <Button
        loading={load}
        mode="outlined"
        onPress={handleReasonSubmit}
        color={COLORS.secondary}
        style={{marginTop: SIZES.icon_size}}>
        Submit request
      </Button>
      <Button
        style={styles._cancel_btn}
        mode="contained"
        onPress={dismissListener}>
        Cancel
      </Button>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding_16,
  },
  _cancel_btn: {
    alignSelf: 'flex-end',
    marginTop: SIZES.size_48,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.padding_16,
  },
});

export default ProjectCancelOrDispute;
