import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

import {View, Text} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {ClientDetails, LoaderSpinner, LoadingNothing} from '../../components';
import {Button, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {NothingToShow} from '../home';

//redux
import {connect, useDispatch} from 'react-redux';

const mapStateToProps = state => {
  const {user_data, clientsData, tasks} = state;
  return {user_data, clientsData, tasks};
};

const ProjectAlert = ({tasks, user_data}) => {
  const {selected_job} = tasks;
  //component state variables
  const [task_alert, setTask_alert] = useState(false);
  //component hooks
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['2%', '50%', '80%'], []);

  useEffect(() => {
    setTask_alert(Object.keys(selected_job).length > 0);
  }, [tasks]);
  return (
    <BottomSheet snapPoints={snapPoints} index={0}>
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
            <ClientDetails />
            <Divider style={{marginVertical: SIZES.padding_12}} />
            <Text
              style={{
                textAlign: 'center',
                ...FONTS.body_medium,
                marginBottom: SIZES.padding_32,
              }}>
              Project title
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                mode="outlined"
                style={{flex: 1}}
                color={COLORS.secondary}>
                Accept
              </Button>
              <Button
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
