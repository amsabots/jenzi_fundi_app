import React, {useState, useEffect, useCallback} from 'react';

import {Button, Chip} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {connect, useDispatch} from 'react-redux';
import {fundiActions} from '../store-actions';

//UI sub components
import {ServiceRequest, PendingRequests} from '../screens/ui-views';

//components
import {
  CircularImage,
  ReviewContainer,
  InfoChips,
  LoaderSpinner,
  LoadingNothing,
  LoadingModal,
} from '.';
//icons
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {pusher_filters} from '../constants';

//toast
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {endpoints} from '../endpoints';
const mapStateToProps = state => {
  const {fundis, user_data} = state;
  return {fundis, user_data};
};

const Loader = ({type = 'a', label = 'Fetching........'}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <LoaderSpinner.ArcherLoader loading={true} />
      <Text>{label}</Text>
    </View>
  );
};

const DetailsView = ({
  leadinglabel = 'No details available',
  fundis,
  user_data,
}) => {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [trainedBy, setTraineddBy] = useState([]);
  const [projects, setLoadProjects] = useState([]);
  // timer to track the request validity period -

  const {selected_fundi: fundi} = fundis;
  const [modal_loader, set_modal_loader] = useState(false);

  //get the title provided and validate
  const handleSendRequest = title => {
    if (!title)
      return Toast.show({
        type: 'error',
        text1: 'Title missing',
        text2: 'You have not provided any valid job title',
      });
    const {clientId} = user_data.user;
    const payload = {
      payload: {title},
      sourceAddress: clientId,
      destinationAddress: fundi.account.accountId,
      filterType: pusher_filters.request_user,
    };
    set_modal_loader(true);
    axios
      .post(`${endpoints.notification_server}/notify`, payload)
      .then(res => {
        payload.requestId = res.data.requestId;
        dispatch(fundiActions.get_all_Sent_requests([payload]));
        return Toast.show({
          type: 'success',
          text2: 'Request sent, Please wait response.....',
        });
      })
      .catch(e => {
        return Toast.show({
          type: 'error',
          text2: 'Failed Retry later.....',
        });
      })
      .finally(() => set_modal_loader(false));
  };

  //call the requests delete endpoint when the cancel icon has been clicked on the requests sent component
  const handleCancelRequest = useCallback(el => {
    axios
      .delete(`${endpoints.notification_server}/notify/${el.requestId}`)
      .then(res => {
        dispatch(fundiActions.delete_current_requests(el));
        Toast.show({
          type: 'success',
          text2: 'Request has been cancelled',
        });
      })
      .catch(e => {
        console.log(e);
        Toast.show({
          type: 'error',
          text2:
            'Request cannot be completed at this time, please try again later',
        });
      });
  });

  return Object.keys(fundi).length ? (
    <View style={styles.container}>
      {/* ===== loading modal */}
      <LoadingModal
        show={modal_loader}
        onDismiss={() => set_modal_loader(false)}
        label="Sending........"
      />
      <CircularImage size={100} url={fundi.account.photo_url} />
      {/*  */}
      <View style={styles._details}>
        <Text style={{...FONTS.body_bold, marginBottom: SIZES.base}}>
          {fundi.account.name || 'Not Available'}
        </Text>
        {/* NCA section */}
        <View>
          <Text style={{...FONTS.captionBold}}>NCA no</Text>
          <Text style={{...FONTS.body_medium}}>1234567890</Text>
        </View>
        {/* ====================== */}
        <View
          style={{
            marginVertical: SIZES.base,
            width: '100%',
          }}>
          <Text style={styles._section_header}>Trained by</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {load ? (
              <Loader label="Loading training organizations........" />
            ) : projects.length ? (
              [1, 2].map((el, idx) => (
                <InfoChips
                  key={idx}
                  text={'NIBS College'}
                  textColor={COLORS.blue_deep}
                  containerStyles={{
                    marginRight: SIZES.padding_4,
                    marginBottom: SIZES.padding_4,
                  }}
                />
              ))
            ) : (
              <LoadingNothing label={'Training not available'} width={100} />
            )}
          </View>
          {/* ============= projects */}
          <View style={{marginVertical: SIZES.padding_12}}>
            <Text style={styles._section_header}>Completed projects</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: SIZES.base,
              }}>
              {load ? (
                <Loader label="Loading user projects]........" />
              ) : trainedBy.length ? (
                [1, 2, 3, 4, 5, 6].map((el, idx) => (
                  <Chip
                    style={{marginBottom: 4, marginRight: SIZES.padding_16}}>
                    SGR construction
                  </Chip>
                ))
              ) : (
                <LoadingNothing label={'0 Projects done'} width={100} />
              )}
            </View>
          </View>
        </View>

        {/* =================== component to show the request sending status =============== */}
        <PendingRequests onCancel={el => handleCancelRequest(el)} />
        {/* ============= ============================= */}
        <View style={styles._border_line}></View>
      </View>
      {/*  */}
      {fundis.sent_requests.length < 1 && (
        <ServiceRequest sendRequest={title => handleSendRequest(title)} />
      )}
      <View style={styles._border_line}></View>
      {/*  */}
      <View style={styles._reviews}>
        <ReviewContainer />
      </View>
    </View>
  ) : (
    <LoadingNothing label={leadinglabel} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SIZES.padding_12,
    paddingHorizontal: SIZES.padding_16,
  },
  _details: {
    marginVertical: SIZES.base,
    width: '100%',
    alignItems: 'center',
  },
  _reviews: {
    width: '100%',
  },
  _section_header: {
    color: COLORS.secondary,
    ...FONTS.captionBold,
    marginBottom: SIZES.base,
  },
  _border_line: {
    borderColor: COLORS.light_secondary,
    borderWidth: SIZES.stroke,
    width: '100%',
    marginVertical: SIZES.padding_12,
  },
});

export const FundiDetails = connect(mapStateToProps)(DetailsView);
