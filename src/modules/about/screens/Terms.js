import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';

import WebView from 'react-native-webview';

const Terms = ({navigation}) => {
  return (
    <>
      <WebView source={{uri: 'https://beta.prifina.com/terms-of-use.html'}} />
    </>
  );
};

export default Terms;
