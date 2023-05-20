import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AboutScreen from './AboutScreen';
import AboutPrifina from './screens/AboutPrifina';
import DataHandle from './screens/DataHandle';
import PrivacyRoadmap from './screens/PrivacyRoadmap';
import Terms from './screens/Terms';

import BackButton from '../../components/BackButton';
import JoinSlack from './screens/JoinSlack';

const AboutStack = createNativeStackNavigator();

const AboutNavigator = ({navigation}) => {
  return (
    <AboutStack.Navigator
      presentation="fullScreenModal" ///???
      screenOptions={{
        presentation: 'fullScreenModal',
        headerLeft: () => <BackButton navigation={navigation} />,
      }}>
      <AboutStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerShown: false,
        }}
      />
      <AboutStack.Screen
        name="AboutPrifina"
        component={AboutPrifina}
        options={{
          headerTitle: '',
        }}
      />
      <AboutStack.Screen
        name="DataHandle"
        component={DataHandle}
        options={{
          headerTitle: '',
        }}
      />
      <AboutStack.Screen
        name="PrivacyRoadmap"
        component={PrivacyRoadmap}
        options={{
          headerTitle: '',
        }}
      />
      <AboutStack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerTitle: '',
        }}
      />
      <AboutStack.Screen
        name="JoinSlack"
        component={JoinSlack}
        options={{
          headerTitle: '',
        }}
      />
    </AboutStack.Navigator>
  );
};

export default AboutNavigator;
