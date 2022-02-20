import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import {Divider, Button, TextInput} from 'react-native-paper';
import {Rating} from 'react-native-ratings';

import {LoadingModal} from '../components';

//redux
import {connect} from 'react-redux';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const RateClient = ({navigation, user_data}) => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState('');
  const [load, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <EnIcon
        name="cross"
        size={SIZES.padding_32}
        style={styles._cancel}
        color={COLORS.secondary}
        onPress={() => navigation.goBack()}
      />
      <Text style={{...FONTS.body1, color: COLORS.secondary}}>
        Rate and Review client name
      </Text>
      <View style={styles._rating}>
        <Rating
          type="heart"
          ratingCount={5}
          imageSize={SIZES.size_48}
          ratingColor={COLORS.secondary}
          onFinishRating={r => setRate(r)}
          startingValue={0}
          jumpValue={0.5}
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
        loading={load}>
        {!load && 'Submit rating & Review'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: SIZES.size_48,
    width: '100%',
  },
});

export default connect(mapStateToProps)(RateClient);
