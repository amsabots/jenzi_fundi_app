import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

//ui components
import {MapMarker} from '../components';

// dispatch
import {useDispatch} from 'react-redux';
const ChatList = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <MapMarker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatList;
