import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ToastAndroid} from 'react-native';
//redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions, user_data_actions} from '../store-actions';

//iocns
import MIcons from 'react-native-vector-icons/MaterialIcons';
import EIcons from 'react-native-vector-icons/Entypo';
//Ui components
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {CircularImage} from '../components';
import {endpoints, errorMessage} from '../endpoints';

import {Button, Dialog, Portal, Paragraph} from 'react-native-paper';
//
import Toast from 'react-native-toast-message';
//UI components
import {LoadingModal} from '../components';
import axios from 'axios';
import asyncStorage from '@react-native-async-storage/async-storage';
import {offline_data} from '../constants';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const Logout = ({navigation, user_data}) => {
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [confirmBtn, setConfirmBtn] = useState('');
  const [type, setType] = useState('');
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
    return () => {
      setModalShow(false);
    };
  }, []);

  const handleLogout = () => {
    setShowConfirmation(true);
    setConfirmText(
      'We are sad to see you gone but you can always come back next time',
    );
    setType('logout');
    setConfirmBtn('Logout');
  };

  const handleDelete = () => {
    setShowConfirmation(true);
    setConfirmText(
      `This action is non reversible, you will loose all your data\n\n Please confirm you want to purge and delete your Account`,
    );
    setType('delete');
    setConfirmBtn('Delete');
  };

  const handleDismiss = () => {
    setShowConfirmation(false);
  };

  const handleOnAccept = () => {
    setShowConfirmation(false);
    setModalShow(true);
    if (type === 'logout') {
      const l = {...user_data.user, active: false};
      delete l['id'];
      axios
        .put(`${endpoints.client_service}/clients/${user_data.user.id}`, l)
        .then(async res => {
          ToastAndroid.show('Logged out', ToastAndroid.LONG);
          dispatch(user_data_actions.delete_user());
          await asyncStorage.removeItem(offline_data.user);
        })
        .catch(e => {
          errorMessage(e);
        })
        .finally(() => setModalShow(false));
    } else if (type === 'delete') {
      Toast.show({type: 'error', text2: 'Deleted account successfully'});
    }
  };

  return (
    <View style={styles.container}>
      <EIcons
        color={COLORS.secondary}
        name="cross"
        size={SIZES.padding_32}
        onPress={() => navigation.goBack()}
      />
      <LoadingModal show={modalShow} label={'Updating account state....'} />
      <View style={styles.content_wrapper}>
        <CircularImage size={120} />
        <Text style={{...FONTS.body1, marginVertical: SIZES.base}}>
          {user_data.user.name || 'Not Available'}
        </Text>
        <Text style={{...FONTS.body_medium}}>
          {user_data.user.email || 'Invalid Account'}
        </Text>
        <Button
          mode="contained"
          style={{
            width: '80%',
            backgroundColor: COLORS.primary,
            marginTop: SIZES.padding_32,
          }}
          onPress={() => handleLogout()}>
          Logout
        </Button>
        <Button
          onPress={handleDelete}
          mode="outlined"
          color={COLORS.secondary}
          style={{
            width: '80%',
            borderColor: COLORS.secondary,
            marginVertical: SIZES.padding_16,
            borderWidth: 1,
          }}>
          Delete Account
        </Button>
      </View>
      {/* dialogur box */}
      <Portal>
        <Dialog visible={showConfirmation} onDismiss={handleDismiss}>
          <Dialog.Content>
            <Paragraph>{confirmText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleOnAccept} color={COLORS.secondary}>
              {confirmBtn}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: SIZES.padding_16},
  content_wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default connect(mapStateToProps)(Logout);
