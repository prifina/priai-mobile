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

import AppContext from './src/hoc/AppContext';

function App() {
  // Amplify.configure(awsConfig);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [defaultValues, setDefaultValues] = useState({
    name: 'User',
    aiName: 'My AI Assistant',
    email: '',
  });

  const demo = true;

  return (
    <AppContext.Provider value={{defaultValues, setDefaultValues, demo}}>
      <MainNavigator />
    </AppContext.Provider>
  );
}

export default App;
// export default withAuthenticator(App);
