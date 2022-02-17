import React from 'react';
import {Appbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/themes';

const DefaultToolBar = ({
  navigation,
  title = 'Jenzi App',
  plus,
  del,
  refresh,
  onRefreshClicked,
  onDeleteClicked,
  onPlusClick,
}) => {
  return (
    <Appbar style={styles.app_bar}>
      <Appbar.Action
        icon="keyboard-backspace"
        onPress={() => navigation.goBack()}
        color={COLORS.white}
      />
      <Appbar.Content title={title} color={COLORS.white} />
      {plus && (
        <Appbar.Action icon="plus" onPress={onPlusClick} color={COLORS.white} />
      )}
      {refresh && (
        <Appbar.Action
          icon="refresh"
          onPress={onRefreshClicked}
          color={COLORS.white}
        />
      )}
      {del && (
        <Appbar.Action
          icon="delete-outline"
          onPress={onDeleteClicked}
          color={COLORS.white}
        />
      )}
    </Appbar>
  );
};

const styles = StyleSheet.create({
  app_bar: {
    backgroundColor: COLORS.secondary,
  },
});

export {DefaultToolBar};
