import React, {useCallback, useEffect, useState} from 'react';

import {View, StyleSheet, Text} from 'react-native';
import {Caption} from 'react-native-paper';
import {DefaultToolBar} from '../components';
//redux stuffs
import {connect, useDispatch} from 'react-redux';
import {UISettingsActions} from '../store-actions';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

//UI components
import {LoaderSpinner, LoadingNothing, LoadingModal} from '../components';

const BillItem = ({transaction}) => {
  const bg_color = '#123456';
  return (
    <View style={{flexDirection: 'row'}}>
      {/* circular text view */}
      <View style={[styles._bill_initial, {backgroundColor: bg_color + 20}]}>
        <Text style={{...FONTS.body1, color: bg_color}}>KJ</Text>
      </View>
      {/* Paid user and project title */}
      <View style={{flex: 1, marginHorizontal: SIZES.padding_12}}>
        <Text style={{...FONTS.body_medium}}>PAID TO USER</Text>
        <Text style={{...FONTS.caption}}>Project Title name</Text>
      </View>
      {/* Amount and date paid */}
      <View style={{alignItems: 'flex-end'}}>
        <Text style={{...FONTS.captionBold}}>- KSHS. 30</Text>
        <Text style={{...FONTS.caption}}>Jun 30 04:30 AM</Text>
      </View>
    </View>
  );
};

const PaymentHistory = () => {
  return (
    <LinearGradient
      start={{x: 0.1, y: 0.5}}
      end={{x: 0.9, y: 0.5}}
      colors={[COLORS.secondary, '#3b5998']}
      style={styles._linear_gradient}>
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View>
          <Text style={{...FONTS.body, color: COLORS.white}}>TOTAL SPENT</Text>
          <Text style={{...FONTS.body1, color: COLORS.white}}>KSHS. 0</Text>
        </View>
        {/* =================== */}
        <View>
          <Text style={{...FONTS.body, color: COLORS.white}}>
            TOTAL OVERDRAFT
          </Text>
          <Text style={{...FONTS.body1, color: COLORS.white}}>KSHS. 0</Text>
        </View>
      </View>
      {/* left */}
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flex: 1,
        }}>
        <View></View>
        <LoaderSpinner.ArcherLoader loading={true} size={80} />
      </View>
    </LinearGradient>
  );
};

const mapStateToProps = state => {
  const {fundis, transactions} = state;
  return {fundis, transactions};
};

const PaymentsView = ({fundis, transactions, navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title={`Billing & Payments`} />

      <View style={styles.wrapper}>
        {/* ==== Top section ===== */}
        <View style={styles.header}>
          <Text style={{...FONTS.body_bold}}>BALANCE</Text>
          <Text style={{...FONTS.h5}}>KSHS. 0</Text>
          <Caption style={{...FONTS.body_medium}}>OVERDRAFT: KSHS. 0</Caption>
        </View>

        <PaymentHistory />
        <View style={styles.border}></View>
        {/* ======= ///// =========== */}

        <View style={styles.statements}>
          <Text
            style={{
              ...FONTS.body_medium,
              color: COLORS.secondary,
              paddingVertical: SIZES.padding_16,
            }}>
            Billing Statements
          </Text>

          <View style={{flex: 1}}>
            {transactions.transactions.length ? (
              <>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={transactions.transactions}
                  key={i => i.transactionId}
                  renderItem={({item}) => {
                    return (
                      <>
                        <BillItem transaction={item} />
                      </>
                    );
                  }}
                />
              </>
            ) : (
              <>
                <View style={styles._extras_full_view}>
                  <LoadingNothing label={'No billing statements available'} />
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SIZES.padding_12,
  },
  border: {
    borderColor: COLORS.light_secondary,
    borderWidth: SIZES.stroke,
    width: '96%',
    alignSelf: 'center',
  },
  statements: {
    flex: 1,
    paddingHorizontal: SIZES.padding_16,
  },
  _bill_initial: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  _extras_full_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _linear_gradient: {
    padding: SIZES.padding_16,
    width: '90%',
    height: 180,
    alignSelf: 'center',
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    flexDirection: 'row',
  },
});

export default connect(mapStateToProps)(PaymentsView);
