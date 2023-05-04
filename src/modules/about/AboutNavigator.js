import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AboutScreen from './AboutScreen';
import AboutPrifina from './screens/AboutPrifina';
import DataHandle from './screens/DataHandle';
import PrivacyRoadmap from './screens/PrivacyRoadmap';
import Terms from './screens/Terms';
import {Text, TouchableOpacity} from 'react-native';

const AboutStack = createNativeStackNavigator();

const AboutNavigator = ({navigation}) => {
  return (
    <AboutStack.Navigator
      presentation="fullScreenModal"
      screenOptions={{
        presentation: 'modal',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Back</Text>
          </TouchableOpacity>
        ),
        header: () => {},
      }}>
      <AboutStack.Screen name="AboutScreen" component={AboutScreen} />
      <AboutStack.Screen name="AboutPrifina" component={AboutPrifina} />
      <AboutStack.Screen name="DataHandle" component={DataHandle} />
      <AboutStack.Screen name="PrivacyRoadmap" component={PrivacyRoadmap} />
      <AboutStack.Screen name="Terms" component={Terms} />
    </AboutStack.Navigator>
  );
};

export default AboutNavigator;
