import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import LinearGradient from 'react-native-linear-gradient';
import {LoadingNothing} from '../../components';
import {Rating} from 'react-native-ratings';
import {Chip} from 'react-native-paper';
import {screens} from '../../constants';

const HomeSummaryInfo = ({user}) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.grey_dark, COLORS.secondary]}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}>
      <Text style={{...FONTS.h6, color: COLORS.white}}>Earnings</Text>
      <View style={styles._details}>
        <View style={styles._right_content}>
          <Text style={{color: COLORS.white, ...FONTS.h5}}>KSHS 0</Text>
        </View>
        <View style={{position: 'absolute', bottom: 30, right: 24}}>
          <LoadingNothing width={80} height={80} />
        </View>
      </View>
    </LinearGradient>
  );
};

const AccountStarRating = ({navigation, reviews, user}) => {
  return (
    <>
      <Text style={{marginTop: SIZES.padding_16, ...FONTS.body_medium}}>
        Rating {'&'} Reviews
      </Text>
      <View style={styles.account_star_rating}>
        <View>
          <Rating
            type="heart"
            ratingCount={5}
            imageSize={SIZES.padding_32}
            ratingColor={COLORS.secondary}
            startingValue={0}
            readonly={true}
          />
          <Text style={styles._rating_caption}>{user?.rating ?? 0} Stars</Text>
        </View>
        {/*  review section */}
        <View>
          <Text style={styles._rating_caption}>{reviews.length} Reviews</Text>
          <Chip
            style={{
              backgroundColor: COLORS.secondary,
              marginLeft: SIZES.base,
              marginTop: SIZES.padding_4,
            }}
            onPress={() =>
              navigation.navigate(screens.fundi_reviews, {reviews})
            }>
            <Text style={{...FONTS.caption, color: COLORS.white}}>
              View Reviews
            </Text>
          </Chip>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.padding_16,
    height: 150,
    width: '100%',
    padding: SIZES.base,
    borderRadius: SIZES.padding_4,
    justifyContent: 'space-between',
  },
  _details: {
    flexDirection: 'row',
    width: '100%',
    flexGrow: 1,
    paddingHorizontal: SIZES.base,
    justifyContent: 'space-between',
  },
  _right_content: {
    justifyContent: 'flex-end',
  },
  account_star_rating: {
    marginVertical: SIZES.padding_16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    paddingVertical: SIZES.padding_16,
    paddingHorizontal: SIZES.base,
    alignItems: 'center',
  },
  _rating_caption: {
    ...FONTS.caption,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});

export {HomeSummaryInfo, AccountStarRating};
