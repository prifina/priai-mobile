import React from 'react';
import {View} from 'react-native';

const Divider = ({width, color, marginVertical, style}) => {
  return (
    <View
      style={[
        style,
        {
          borderBottomWidth: width === undefined ? 1 : width,
          borderBottomColor: color === undefined ? '#EAECF0' : color,
          marginVertical: marginVertical === undefined ? 20 : marginVertical,
        },
      ]}
    />
  );
};

export default Divider;
