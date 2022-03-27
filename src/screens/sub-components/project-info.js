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
import {jobUtils} from '../../pusher';

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
import {offline_data, pusher_filters, screens} from '../../constants';
import {
  chat_actions,
  clientActions,
  UISettingsActions,
} from '../../store-actions';

const mapStateToProps = state => {
  const {user_data, clientsData, tasks} = state;
  return {user_data, clientsData, tasks};
};

const ProjectAlert = ({tasks, user_data, clientsData, navigation}) => {
  const {client_request, selected_client} = clientsData;
  //component state variables
  const [task_alert, setTask_alert] = useState(false);
  //component hooks
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['10%', '50%', '80%'], []);
  const sheetRef = useRef();
  const handleRequestRejection = async () => {
    try {
      // update redis record
      await axios.put(
        `${endpoints.notification_base}/jobs/requests/${client_request.requestId}`,
        {
          status: 'REQUESTDECLINED',
        },
      );
      // update firebase records in the db
      await jobUtils.update_client(
        'REQUESTDECLINED',
        selected_client.clientId,
        client_request.requestId,
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(clientActions.expire_request());
      toast.show({type: 'success', text1: 'Sent response to client'});
      await jobUtils.delete_entry(user_data.user.accountId);
      dispatch(
        UISettingsActions.toggle_snack_bar(
          `Request has been cancelled successfully. Thank you for being our active member`,
        ),
      );
    }
  };

  const handle_accept_request = async () => {
    try {
      // update the redis record in the db
      await axios.put(
        `${endpoints.notification_base}/jobs/requests/${client_request.requestId}`,
        {
          status: 'REQUESTACCEPTED',
        },
      );
      // update client alert entries in firebase
      await jobUtils.update_client(
        'REQUESTACCEPTED',
        selected_client.clientId,
        client_request.requestId,
      );
      await AsyncStorage.setItem(
        offline_data.current_project_user,
        JSON.stringify(selected_client),
      );
      dispatch(
        UISettingsActions.toggle_snack_bar(
          `Congratulations ${user_data.user.name}, new project has been initiated`,
        ),
      );
      dispatch(chat_actions.active_chat(selected_client));
      navigation.navigate(screens.conversation);
    } catch (error) {
      console.log(
        `[file: project-info.js] [action: accept response failed to reach destination] [message: ${error}]`,
      );
      ToastAndroid.showWithGravity(
        'Project creation failed during initiation. Sorry for the inconvenience',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    } finally {
      dispatch(clientActions.expire_request());
      await jobUtils.delete_entry(user_data.user.accountId);
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
