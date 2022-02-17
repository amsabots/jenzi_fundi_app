import React, {useState, useEffect, useMemo, memo, useCallback} from 'react';
import {Button, Portal, Modal, TextInput} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
// constants
import {SIZES} from '../../constants/themes';
import {COLORS} from '../../constants/themes';
//
import _ from 'lodash';

//redux
import {useDispatch, connect} from 'react-redux';
import axios from 'axios';
//
import {endpoints} from '../../endpoints';
import Toast from 'react-native-toast-message';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const RequestTitle = memo(({onAccept, show = false, onHide}) => {
  const [title, setTitle] = useState('');
  return (
    <Portal>
      <Modal
        visible={show}
        onDismiss={onHide}
        contentContainerStyle={styles.modal_conatiner}>
        <View>
          <TextInput
            placeholder="Enter project title"
            dense={true}
            mode="outlined"
            outlineColor={COLORS.secondary}
            activeOutlineColor={COLORS.secondary}
            multiline={true}
            onChangeText={t => setTitle(t)}
          />
          <View
            style={{
              marginTop: SIZES.padding_16,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button onPress={onHide} color={COLORS.primary}>
              Cancel
            </Button>
            <Button onPress={() => onAccept(title)} color={COLORS.secondary}>
              Send Request
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
});

const ServiceRequestView = ({sendRequest, fundis}) => {
  const [showModal, setShowModal] = useState(false);
  const {selected_fundi} = fundis;
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    //change this to reflect the currently user id string
    axios
      .get(`${endpoints.notification_server}/notify/andrewmwebi`)
      .then(res => {
        //check if an object with similar user id is present and disable the button
      })
      .catch(e =>
        Toast.show({
          type: 'error',
          text1: 'Failed to update the state properly, Refresh.',
        }),
      );
  });

  const handleAccept = useCallback(
    t => {
      sendRequest(t);
      setShowModal(false);
    },
    [showModal],
  );
  return (
    <View style={{marginVertical: SIZES.padding_16}}>
      <Button
        mode="contained"
        disabled={disableBtn}
        style={{backgroundColor: COLORS.secondary}}
        onPress={() => {
          setShowModal(true);
        }}>
        request service
      </Button>
      <RequestTitle
        show={showModal}
        onHide={() => setShowModal(false)}
        onAccept={d => handleAccept(d)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modal_conatiner: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding_32,
    marginHorizontal: SIZES.padding_16,
    borderRadius: SIZES.base,
  },
});

export const ServiceRequest = connect(mapStateToProps)(ServiceRequestView);
