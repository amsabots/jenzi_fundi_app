import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import {DefaultToolBar, LoadingModal} from '../components';
import {COLORS, SIZES} from '../constants/themes';
import {Button} from 'react-native-paper';
import _ from 'lodash';
import axios from 'axios';
import {endpoints, axios_endpoint_error} from '../endpoints';
import AwesomeAlert from 'react-native-awesome-alerts';
import {update_user_info} from '../config/utils';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

//prettier-ignore
export const CustomTextInputView = ({name, value, onTextChange, label, ...otherprops}) => {
  return (
    <TextInput
      value={value}
      style={{
        marginBottom: SIZES.padding_16,
      }}
      underlineColorAndroid="transparent"
      activeOutlineColor={COLORS.blue_deep}
      dense={true}
      label={label}
      mode={'outlined'}
      {...otherprops}
      onChangeText={txt => onTextChange({[name]: txt})}
    />
  );
};
const BasicInfoScreen = ({navigation, user_data}) => {
  const {user} = user_data;
  const [user_info, set_user_info] = useState(
    _.pick(user, ['nca_number', 'name', 'email', 'phone_number']),
  );
  const [show_loading, set_loading] = useState(false);
  const [hide_modal, set_hde_modal] = useState(false);

  const submit_edit_details = () => {
    set_loading(true);
    axios
      .put(`/fundi/${user.id}`, user_info)
      .then(res => {
        update_user_info(user.id);
        set_hde_modal(true);
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  const handle_input_change = obj => {
    set_user_info(prev => {
      return {...prev, ...obj};
    });
  };
  return (
    <View style={{flex: 1}}>
      <DefaultToolBar navigation={navigation} title={'Basic info'} />
      <View style={styles.wrapper}>
        <View style={styles._form}>
          <CustomTextInputView
            label={'Official Name'}
            name={'name'}
            value={user_info.name}
            onTextChange={obj => handle_input_change(obj)}
          />
          <CustomTextInputView
            label={'NCA number'}
            value={user_info.nca_number}
            name={'nca_number'}
            onTextChange={obj => handle_input_change(obj)}
          />

          <CustomTextInputView
            label={'Email'}
            value={user_info?.email}
            name={'email'}
            onTextChange={obj => handle_input_change(obj)}
          />
          <CustomTextInputView
            label={'Active phone number'}
            value={user_info?.phone_number || user.username}
            name={'phone_number'}
            onTextChange={obj => handle_input_change(obj)}
          />
          <Button
            style={{marginTop: SIZES.padding_32}}
            mode="contained"
            onPress={submit_edit_details}
            loading={show_loading}>
            Update Account
          </Button>
        </View>
      </View>
      <LoadingModal />
      <AwesomeAlert
        show={hide_modal}
        title={'Update complete'}
        message={'Profile details updated successfully'}
        cancelText="Close"
        showCancelButton={true}
        onDismiss={() => set_hde_modal(false)}
        onCancelPressed={() => set_hde_modal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: SIZES.padding_32,
  },
  _form: {
    paddingHorizontal: SIZES.padding_16,
    paddingTop: SIZES.padding_16,
  },
});
export default connect(mapStateToProps)(BasicInfoScreen);
