import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import {Divider, Button, TextInput} from 'react-native-paper';

import {LoadingModal, ClientDetails} from '../components';

//redux
import {connect, useDispatch} from 'react-redux';
import {UISettingsActions} from '../store-actions';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProjectInfo = ({navigation, user_data}) => {
  //component state variables

  //component hooks
  const dispatch = useDispatch();
  const btmSheetRef = useRef(null);

  //use effect hooks
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);
  return (
    <View style={styles.container}>
      <EnIcon
        name="cross"
        size={SIZES.padding_32}
        style={styles._cancel}
        color={COLORS.secondary}
        onPress={() => navigation.goBack()}
      />
      {/* ===========   PAGE CLIENT DETAILS ============= */}

      <ClientDetails />
      {/*  ========== PAGE PROJECT INFO ================= */}
      <Text
        style={{...FONTS.body, fontWeight: 'bold', padding: SIZES.padding_16}}>
        Project Details
      </Text>
      {/* ============================================== */}
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _cancel: {
    position: 'absolute',
    top: SIZES.padding_16,
    left: SIZES.padding_16,
    zIndex: 100,
  },
  _project_details: {},
});

export default connect(mapStateToProps)(ProjectInfo);
