import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Chip} from 'react-native';
import {LoaderSpinner} from '../components';

//icons
import IoIcons from 'react-native-vector-icons/Ionicons';
import {COLORS, SIZES} from '../constants/themes';

const data = Array.from(Array(100).keys());
const ChatItem = ({item}) => {
  return (
    <View style={[styles._bubble_width, styles._bubble_to]}>
      <Text>Hi {item}</Text>
    </View>
  );
};

const TopHeader = ({nav}) => {
  return (
    <View style={styles.header}>
      <IoIcons
        name="chevron-back"
        size={SIZES.padding_32}
        color={COLORS.white}
        onPress={() => nav.goBack()}
      />
    </View>
  );
};

const ConversationScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <View style={styles.container}>
      <TopHeader nav={navigation} />
      <View style={styles.content_area}>
        <FlatList
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return <ChatItem item={item} />;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: SIZES.padding_12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.base,
    justifyContent: 'space-between',
  },
  content_area: {
    flex: 1,
    backgroundColor: COLORS.light_secondary,
    paddingHorizontal: SIZES.base,
  },
  _bubble_width: {
    width: '94%',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.padding_16,
    marginBottom: SIZES.padding_12,
    borderRadius: SIZES.padding_16,
  },
  _bubble_from: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 0,
  },
  _bubble_from_text: {
    color: COLORS.white,
  },
  _bubble_to: {
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 0,
  },
  _bubble_to_text: {
    color: COLORS.white,
  },
});

export default ConversationScreen;
