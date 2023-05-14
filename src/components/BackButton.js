import React from 'react';
import {TouchableOpacity} from 'react-native';

import ChevronLeftIcon from '../assets/chevron-left.svg';

const BackButton = ({navigation}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={handleGoBack}>
      <ChevronLeftIcon />
    </TouchableOpacity>
  );
};

export default BackButton;
