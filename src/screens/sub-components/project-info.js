import React, {useState, useCallback, useMemo, memo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

import {View, Text} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {ClientDetails, LoaderSpinner} from '../../components';
import {Button, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

const ProjectAlert = () => {
  const snapPoints = useMemo(() => ['2%', '50%', '80%'], []);
  return (
    <BottomSheet snapPoints={snapPoints} index={0}>
      <ScrollView>
        <Text
          style={{
            textAlign: 'center',
            ...FONTS.body_bold,
            color: COLORS.secondary,
          }}>
          New Project Alert!
        </Text>
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
            <Button mode="outlined" style={{flex: 1}} color={COLORS.secondary}>
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
      </ScrollView>
    </BottomSheet>
  );
};

export default ProjectAlert;
