import React from 'react';
import {connect, useDispatch} from 'react-redux';
import {DefaultToolBar} from '../components';
import {View, Text, StyleSheet} from 'react-native';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const PasswordRest = ({navigation, user_data}) => {
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title="Password manager" />
      <View style={styles.container}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(PasswordRest);
