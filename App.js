/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MainNavigator from './src/navigation/MainNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App() {
  // Amplify.configure(awsConfig);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <MainNavigator />
      </GestureHandlerRootView>
    </>
  );
}

export default App;
// export default withAuthenticator(App);
