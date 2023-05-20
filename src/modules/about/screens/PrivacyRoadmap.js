import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';

import WebView from 'react-native-webview';

const PrivacyRoadmap = ({navigation}) => {
  return (
    <>
      <WebView source={{uri: 'https://beta.prifina.com/privacy-policy.html'}} />
    </>
  );
};

export default PrivacyRoadmap;
