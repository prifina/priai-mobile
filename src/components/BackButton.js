import React from 'react';
import {TouchableOpacity} from 'react-native';

import ChevronLeftIcon from '../assets/chevron-left.svg';

const BackButton = ({navigation}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      onPress={handleGoBack}
      hitSlop={{top: 30, bottom: 30, left: 10, right: 30}}>
      <ChevronLeftIcon />
    </TouchableOpacity>
  );
};

export default BackButton;
