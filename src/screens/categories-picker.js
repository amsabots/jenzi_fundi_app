import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {DefaultToolBar} from '../components';
import {SIZES} from '../constants/themes';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const CategoriesPicker = ({navigation, user_data}) => {
  const [categories, set_categories] = useState([]);
  const [loading, set_loading] = useState(false);
  //
  useEffect(() => {
    set_loading(true);
    axios
      .get(`/job-category`)
      .then(result => {})
      .catch(err => {
        axios_endpoint_error(err);
      })
      .finally(() => set_loading(false));
    return () => {
      set_loading(false);
    };
  }, []);
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title="Job categories" />
      <View style={styles.wrapper}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingTop: SIZES.base,
  },
});

export default connect(mapStateToProps)(CategoriesPicker);
