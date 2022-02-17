import React from 'react';
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  Menu,
  Divider,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';

const ProjectOptions = ({
  project,
  show,
  onDismiss,
  onUpdateState,
  onDeleteRequested,
}) => {
  return (
    <>
      <Portal>
        <Modal
          visible={show}
          onDismiss={onDismiss}
          contentContainerStyle={styles.container}>
          <View>
            <Text style={styles.title}>{project.title}</Text>
            <View
              style={{
                width: '100%',
                borderWidth: SIZES.stroke,
                borderColor: COLORS.disabled_grey,
              }}></View>
            <Menu.Item
              onPress={() => onUpdateState()}
              title="Update State"
              icon={'update'}
            />
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding_12,
    borderRadius: SIZES.padding_4,
    paddingVertical: SIZES.padding_16,
    paddingHorizontal: SIZES.base,
  },
  title: {
    marginBottom: SIZES.padding_12,
    marginLeft: SIZES.padding_16,
    color: COLORS.secondary,
    ...FONTS.body_bold,
  },
});

export {ProjectOptions};
