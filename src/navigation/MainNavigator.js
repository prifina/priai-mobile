import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

// import {Auth} from 'aws-amplify';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const MainNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // async function checkAuth() {
  //   try {
  //     await Auth.currentAuthenticatedUser();
  //     setIsLoggedIn(true);
  //   } catch (err) {
  //     setIsLoggedIn(false);
  //   }
  // }
  const user = true;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
