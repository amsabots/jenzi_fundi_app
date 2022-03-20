import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import {Divider, Button, TextInput, Snackbar} from 'react-native-paper';
import {Rating} from 'react-native-ratings';

import {LoadingModal, LoadingNothing} from '../components';

//redux
import {connect} from 'react-redux';

const nothing_to_show = (
  <View style={{marginTop: SIZES.padding_16}}>
    <LoadingNothing label={'No Reviews for this user'} width={150} />
  </View>
);

export const ReviewItem = ({review, onLonpressListener}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => onLonpressListener(review)}>
      <Text>This guy is super awesome, i love his work ethics alot</Text>
      <View
        style={{
          marginTop: SIZES.base,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{...FONTS.caption}}>time posted ago</Text>
        <Text style={{...FONTS.caption, color: COLORS.blue_deep}}>
          posted by
        </Text>
      </View>
      <Divider
        style={{marginTop: SIZES.base, marginBottom: SIZES.padding_16}}
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const RateClient = ({navigation, user_data, route}) => {
  const {fundi} = route.params;
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState('');
  const [load, setLoading] = useState(false);
  const [reviews, setReviews] = useState([1]);
  const [ui_refresher, setUIRefresher] = useState(Math.random());
  const [snackVisible, setSnackVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSubmitRates = () => {
    console.log(rate);
  };

  const handleReviewDelete = () => {
    console.log('deleting review');
    setSnackVisible(false);
  };

  const get_rates = () => {};

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <EnIcon
          name="cross"
          size={SIZES.padding_32}
          style={styles._cancel}
          color={COLORS.secondary}
          onPress={() => navigation.goBack()}
        />
        <Text style={{...FONTS.body1, color: COLORS.secondary}}>
          Rate and Review {fundi.name}
        </Text>
        <View style={styles._rating}>
          <Rating
            type="heart"
            ratingCount={5}
            imageSize={SIZES.size_48}
            ratingColor={COLORS.secondary}
            onFinishRating={r => setRate(r)}
            startingValue={0}
            jumpValue={0.1}
            fractions={true}
          />
        </View>
        <TextInput
          mode="outlined"
          multiline={true}
          numberOfLines={3}
          style={styles._input}
          outlineColor={COLORS.secondary}
          placeholder="Write your review"
          activeOutlineColor={COLORS.secondary}
          onChangeText={txt => setReview(txt)}
        />
        <Button
          mode="outlined"
          color={COLORS.secondary}
          style={styles._btn}
          onPress={handleSubmitRates}
          loading={load}>
          {!load && 'Submit rating & Review'}
        </Button>

        <View style={styles._review_area}>
          <Divider />
          <Text style={{...FONTS.caption, marginVertical: SIZES.padding_12}}>
            User Reviews
          </Text>
          {!reviews.length
            ? nothing_to_show
            : reviews.map((el, idx) => (
                <ReviewItem
                  key={idx}
                  review={el}
                  onLonpressListener={r => {
                    setSelected(r);
                    setSnackVisible(true);
                  }}
                />
              ))}
        </View>

        {/*  ============= FLOATING AND ABSOLUTE ALIGNING VIEWS ========== */}
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          action={{
            label: 'Undo',
            onPress: handleReviewDelete,
          }}>
          Confirm removal of your review entry
        </Snackbar>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.padding_32,
    backgroundColor: COLORS.white,
  },
  _cancel: {
    position: 'absolute',
    top: SIZES.padding_32,
    left: SIZES.padding_16,
  },
  _input: {
    width: '100%',
  },
  _rating: {
    marginVertical: SIZES.padding_16,
  },
  _btn: {
    borderColor: COLORS.secondary,
    marginTop: SIZES.padding_32,
    width: '100%',
  },
  _review_area: {
    width: '100%',
    height: '100%',
    marginTop: SIZES.padding_16,
  },
});

export default connect(mapStateToProps)(RateClient);
