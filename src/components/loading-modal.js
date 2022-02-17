import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, Portal, Text, Button, Provider} from 'react-native-paper';
import {LoaderSpinner} from '.';
import {FONTS, SIZES} from '../constants/themes';

const LoadingModal = ({
  onDismiss,
  show,
  label = 'Processing....',
  useDubleRing = true,
}) => {
  return (
    <Portal>
      <Modal
        visible={show}
        contentContainerStyle={styles._modal_style}
        onDismiss={onDismiss}>
        {useDubleRing ? (
          <LoaderSpinner.DoubleRing loading={true} size={SIZES.size_48} />
        ) : (
          <LoaderSpinner.ArcherLoader loading={true} size={SIZES.size_48} />
        )}
        <Text style={{...FONTS.body_medium}}>{label}</Text>
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  _modal_style: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: SIZES.base,
    padding: SIZES.padding_16,
  },
});

export {LoadingModal};
