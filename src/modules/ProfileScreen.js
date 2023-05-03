import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {View, Text, Button} from 'react-native';

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

const ProfileScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => console.log('Button pressed')} title="Save" />
      ),
    });
  }, [navigation]);

  /////APPLE HEALTHKIT

  /* Permission options */
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.Steps,
      ],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  };

  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
  };

  AppleHealthKit.initHealthKit(permissions, error => {
    /* Called after we receive a response from the system */

    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
    }

    /* Can now read or write to HealthKit */

    AppleHealthKit.getHeartRateSamples(options, (callbackError, results) => {
      /* Samples are now collected from HealthKit */
    });
  });

  const [stepCount, setStepCount] = useState([]);

  AppleHealthKit.getStepCount(options, (err, results) => {
    if (err) {
      console.log('error results');

      return;
    }
    console.log('results', results);
    setStepCount(results.value);
  });

  return (
    <View style={{flex: 1}}>
      <Text>ads</Text>
    </View>
  );
};

export default ProfileScreen;
