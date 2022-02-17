import React, {useMemo, useState, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
//reactive native paper
import {Button} from 'react-native-paper';
import {COLORS, FONTS, SIZES} from '../constants/themes';
//icons
import EIcons from 'react-native-vector-icons/EvilIcons';
import AD from 'react-native-vector-icons/AntDesign';
//document picker
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
// flat list from gesture handler
import {FlatList} from 'react-native-gesture-handler';

const PickedImageItem = ({img, onItemClick}) => {
  const {name, type} = img;
  const name_lenght = name.split('.').length;
  return (
    <View style={styles._img_wrapper}>
      <Text>{name.substring(0, name.length > 16 ? 16 : img.length)}</Text>
      <Text>{name.split('.')[name_lenght - 1] || 'unknown'}</Text>
      <TouchableOpacity>
        <AD
          name="delete"
          color={COLORS.danger}
          size={SIZES.icon_size_focused}
          onPress={() => onItemClick(img)}
        />
      </TouchableOpacity>
    </View>
  );
};

const ImageSelector = ({
  sheetRef,
  selectMultiple = false,
  onImagesPicked,
  buttonLabel = 'Submit',
  pickerLabel = 'Pick file',
}) => {
  const snapPoints = useMemo(() => [0, '20%', '60%', '90%'], []);
  const [images, setImages] = useState([]);

  // component functions
  const handleImagePicker = async () => {
    setImages([]);
    if (!selectMultiple) {
      const r = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      setImages([r]);
    } else {
      const r = await DocumentPicker.pickMultiple();
      setImages([...r]);
    }
  };

  const handleDeleteImg = img => {
    setImages(images.filter((_, idx) => images.indexOf(img) !== idx));
  };

  return (
    <BottomSheet ref={sheetRef} initialSnapIndex={0} snapPoints={snapPoints}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles._upload_container}
          onPress={() => {
            handleImagePicker();
          }}>
          <EIcons name="image" size={SIZES.size_48} color={COLORS.secondary} />
          <Text style={{...FONTS.body_medium}}>{pickerLabel}</Text>
        </TouchableOpacity>

        {/* flat list */}
        <View style={styles._view_container}>
          <FlatList
            data={images}
            key={item => item.name}
            renderItem={({item}) => {
              return (
                <PickedImageItem
                  img={item}
                  onItemClick={img => handleDeleteImg(img)}
                />
              );
            }}
          />
        </View>
        {images.length ? (
          <View style={{marginTop: SIZES.padding_32}}>
            <TouchableOpacity
              style={{marginBottom: 16}}
              onPress={() => setImages([])}>
              <Text style={{color: COLORS.danger, ...FONTS.body1}}>
                Clear all
              </Text>
            </TouchableOpacity>
            <Button
              style={{backgroundColor: COLORS.secondary}}
              color={COLORS.white}
              onPress={() => onImagesPicked(images)}>
              {buttonLabel}
            </Button>
          </View>
        ) : null}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding_16,
    paddingVertical: SIZES.base,
  },
  _upload_container: {
    alignSelf: 'baseline',
    alignItems: 'center',
  },
  _view_container: {
    marginTop: SIZES.padding_16,
  },
  _img_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
    paddingBottom: SIZES.base,
    width: '100%',
    borderBottomColor: COLORS.disabled_grey,
    borderBottomWidth: SIZES.stroke,
  },
});

export {ImageSelector};
