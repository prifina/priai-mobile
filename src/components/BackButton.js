import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

import ChevronLeftIcon from '../assets/chevron-left.svg';

const BackButton = ({navigation}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      onPress={handleGoBack}
      style={{flexDirection: 'row', alignItems: 'center'}}
      hitSlop={{top: 30, bottom: 30, left: 10, right: 30}}>
      <ChevronLeftIcon />
      <Text
        style={{
          marginLeft: 11,
          color: '#475467',
          lineHeight: 20,
          fontSize: 14,
          fontWeight: 600,
        }}>
        Back
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
