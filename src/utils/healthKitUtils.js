import AppleHealthKit from 'react-native-health';
import {Alert} from 'react-native';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.StepCount],
  },
};

// past year
const options = {
  startDate: new Date(2023, 0, 1).toISOString(),
  endDate: new Date().toISOString(),
};

export const initHealthKit = async () => {
  try {
    await AppleHealthKit.initHealthKit(permissions);
    Alert.alert(
      'Success',
      'HealthKit successfully initialized.',
      [{text: 'OK', onPress: () => console.log('OK pressed')}],
      {cancelable: false},
    );
  } catch (error) {
    Alert.alert(
      'Error',
      'Failed to initialize HealthKit. Please try again.',
      [{text: 'OK', onPress: () => console.log('OK pressed')}],
      {cancelable: false},
    );
    throw error;
  }
};

export const getSamples = async () => {
  try {
    const results = await AppleHealthKit.getSamples(options);
    return results;
  } catch (error) {
    Alert.alert(
      'Error',
      'Failed to retrieve health data. Please try again.',
      [{text: 'OK', onPress: () => console.log('OK pressed')}],
      {cancelable: false},
    );
    throw error;
  }
};
