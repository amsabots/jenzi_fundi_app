import React, {useEffect, useRef, useState, memo} from 'react';

import {View, StyleSheet, Text} from 'react-native';
import RNMapView, {Marker, Circle} from 'react-native-maps';
import {COLORS} from '../constants/themes';
//
import {connect} from 'react-redux';

//ui components
import {MapMarker} from '.';
import {DoubleRing} from './loading-animated';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const Mapview = ({coordinates, onMarkerClicked, fundis}) => {
  const {latitude, longitude} = coordinates;
  const mapRef = useRef(null);

  const centerToUseLocation = () => {
    if (!!coordinates && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude,
          longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }
  };

  useEffect(() => {
    centerToUseLocation();
  }, [coordinates]);

  return (
    <RNMapView
      ref={mapRef}
      style={{...StyleSheet.absoluteFillObject}}
      loadingEnabled
      rotateEnabled={false}
      toolbarEnabled={false}
      loadingBackgroundColor={COLORS.white}>
      {/* current user maker */}
      {Object.values(coordinates).filter(Boolean).length > 1 && (
        <Marker coordinate={coordinates} title="Your current location">
          <View style={styles.dotContainer}>
            <View style={[styles.arrow]} />
            <View style={styles.dot} />
          </View>
        </Marker>
      )}
      {fundis.fundis.length
        ? fundis.fundis.map((element, idx) => {
            const {
              account: {latitude, longitude, accountId, name},
              distance,
            } = element;
            return (
              <Marker
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                title={name || 'Not available'}
                onCalloutPress={() => onMarkerClicked(element)}
                description={
                  distance < 1
                    ? (distance * 1000).toFixed(2) + ' Meters away'
                    : distance + 'KMs away'
                }
                key={accountId}>
                <MapMarker avatar_size={40} />
              </Marker>
            );
          })
        : null}
    </RNMapView>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: COLORS.blue_deep,
    width: 16,
    height: 16,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.blue_deep,
  },
});

export const MapView = connect(mapStateToProps)(memo(Mapview));
