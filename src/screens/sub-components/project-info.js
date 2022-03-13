import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
//sqlite
import AsyncStorage from '@react-native-async-storage/async-storage';

import {View, Text, ToastAndroid} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {ClientDetails, LoaderSpinner, LoadingNothing} from '../../components';
import {Button, Divider, Snackbar} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

//redux
import {connect, useDispatch} from 'react-redux';
import axios from 'axios';
import {endpoints} from '../../endpoints';
import toast from 'react-native-toast-message';

import {popPushNotification} from '../../notifications';
import {offline_data, pusher_filters} from '../../constants';
import {clientActions, UISettingsActions} from '../../store-actions';
import {delete_current_request} from '../../pusher/project-ops';

const mapStateToProps = state => {
  const {user_data, clientsData, tasks} = state;
  return {user_data, clientsData, tasks};
};

const ProjectAlert = ({tasks, user_data, clientsData}) => {
  const {client_request, selected_client} = clientsData;
  //component state variables
  const [task_alert, setTask_alert] = useState(false);
  //component hooks
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['2%', '50%', '80%'], []);
  const sheetRef = useRef();
  const handleRequestRejection = async () => {
    try {
      delete_current_request(client_request.requestId);
      await axios.post(`${endpoints.notification_server}/notify-once`, {
        payload: {
          requestId: client_request.requestId,
        },
        sourceAddress: user_data.user.accountId,
        destinationAddress: selected_client.clientId,
        filterType: pusher_filters.user_rejected,
      });
    } catch (error) {
    } finally {
      dispatch(clientActions.expire_request());
      toast.show({type: 'success', text1: 'Response sent'});
    }
  };

  const handle_accept_request = async () => {
    try {
      delete_current_request(client_request.requestId);
      await axios.post(`${endpoints.notification_server}/notify`, {
        payload: {
          title: client_request.title,
        },
        sourceAddress: user_data.user.accountId,
        destinationAddress: selected_client.clientId,
        filterType: pusher_filters.user_accepted,
        requestId: client_request.requestId,
      });
      await AsyncStorage.setItem(
        offline_data.current_project_user,
        JSON.stringify(selected_client),
      );
      toast.show({text1: 'Project has been initiated', position: 'top'});
      dispatch(
        UISettingsActions.toggle_snack_bar(
          `Congratulations ${user_data.user.name}, you have secured a project with the client identified as ${selected_client.name}. We will help you track and connect with the specified client`,
        ),
      );
    } catch (error) {
      console.log(
        `[file: project-info.js] [action: deleting sent request] [message: ${error}]`,
      );
      ToastAndroid.showWithGravity(
        'Project creation failed during initiation. Sorry for the inconvenience',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      dispatch(clientActions.expire_request());
    }
  };

  useEffect(() => {
    const is_available = Object.keys(client_request).length > 0;
    setTask_alert(is_available);
    if (is_available) {
      sheetRef.current.snapTo(2);
    } else {
      sheetRef.current.snapTo(0);
    }
  }, [clientsData]);
  return (
    <BottomSheet snapPoints={snapPoints} index={0} ref={sheetRef}>
      {task_alert ? (
        <ScrollView>
          <Text
            style={{
              textAlign: 'center',
              ...FONTS.body_bold,
              color: COLORS.secondary,
            }}>
            {task_alert ? ' New Project Alert!' : 'Project notification window'}
          </Text>
          {/* =============== START OF PROJECT NOTIFICATION WIZARD ============== */}
          <View style={{paddingHorizontal: SIZES.padding_16}}>
            <ClientDetails client_details={selected_client} />
            <Divider style={{marginVertical: SIZES.padding_12}} />
            <Text
              style={{
                textAlign: 'center',
                ...FONTS.body_medium,
                marginBottom: SIZES.padding_32,
              }}>
              {client_request.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                mode="outlined"
                style={{flex: 1}}
                color={COLORS.secondary}
                onPress={handle_accept_request}>
                Accept
              </Button>
              <Button
                onPress={handleRequestRejection}
                style={{
                  flex: 1,
                  marginLeft: SIZES.base,
                  backgroundColor: COLORS.secondary,
                }}
                mode="contained">
                Decline
              </Button>
            </View>

            {/* ======== decorative ======= */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: SIZES.paddingd_32,
              }}>
              <LoaderSpinner.Wave height={150} width={180} />
            </View>
          </View>
          {/* ========= END OF PROJECT NOTIFICATION WIZARD =========== */}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: SIZES.padding_16,
          }}>
          <Text style={{...FONTS.captionBold, marginBottom: SIZES.padding_12}}>
            Jenzi smart - Innovation in the construction industry
          </Text>
          <LoadingNothing
            label={
              'Project notification will appear here. You will have an option of either accepting or declining the offer. Make sure your account profile is in public mode'
            }
          />
        </View>
      )}
    </BottomSheet>
  );
};

export default connect(mapStateToProps)(ProjectAlert);
