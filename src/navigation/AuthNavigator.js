import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../modules/LoginScreen';
import ConfirmationCodeScreen from '../modules/ConfirmationCodeScreen';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen
        name="ConfirmationCodeScreen"
        component={ConfirmationCodeScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
