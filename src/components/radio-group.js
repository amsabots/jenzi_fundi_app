import React, {useState, memo} from 'react';
import {RadioButton} from 'react-native-paper';
import {View, Text} from 'react-native';

// radio button component
const AppRadioButton = ({selected, options, onRadioButtonChangeListener}) => {
  const [value, setValue] = useState(selected);
  return (
    <RadioButton.Group
      onValueChange={newValue => {
        setValue(newValue);
        onRadioButtonChangeListener(newValue);
      }}
      value={value}>
      {options.map((el, idx) => (
        <View key={idx} style={{flexDirection: 'row', alignItems: 'center'}}>
          <RadioButton value={el.value} />
          <Text>{el.label}</Text>
        </View>
      ))}
    </RadioButton.Group>
  );
};

export default AppRadioButton;
