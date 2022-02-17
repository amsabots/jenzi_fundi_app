import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
//redux
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions, user_data_actions} from '../store-actions';
//sqlite
import storage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

import {offline_data, screens} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {LoadingNothing, LoaderSpinner} from '../components';
import {SIZES} from '../constants/themes';
import {UISettings} from '../../store/ui-store';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const MainActivity = ({user_data}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    SplashScreen.hide();
    dispatch(UISettingsActions.status_bar(false));
    storage
      .getItem(offline_data.user)
      .then(d => {
        dispatch(user_data_actions.create_user(JSON.parse(d)));
        if (d)
          navigation.reset({
            index: 0,
            routes: [{name: screens.stack_app}],
          });
        else
          navigation.reset({
            index: 0,
            routes: [{name: screens.stack_auth}],
          });
      })
      .catch(err => dispatch(user_data_actions.delete_user()));
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <LoaderSpinner.DoubleRing size={48} loading={true} />
      </View>
      <View style={{marginTop: SIZES.padding_32}}>
        <LoadingNothing label={'Preparing environment....'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps)(MainActivity);
