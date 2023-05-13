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

import AppleHealthKit from 'react-native-health';
import useDatabaseHooks from './useDatabaseHooks';

const {insertData} = useDatabaseHooks();

const initHealthKit = async () => {
  const permissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.StepCount],
    },
  };

  AppleHealthKit.initHealthKit(permissions, error => {
    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
      return false;
    }
    return true;
  });
};

const getSteps = async () => {
  const options = {
    startDate: new Date(2023, 0, 1).toISOString(),
    endDate: new Date().toISOString(),
  };

  AppleHealthKit.getSamples(options, (err, results) => {
    if (err) {
      console.log('error getting steps:', err);
      return;
    }
    console.log('results', results);

    // average steps
    const stepsPerDay = {};

    results.forEach(entry => {
      const date = new Date(entry.start).toDateString(); // convert start time to date string - ignore hours  minutes  seconds
      stepsPerDay[date] = (stepsPerDay[date] || 0) + entry.quantity; // accumulate steps per day
    });

    for (const [date, steps] of Object.entries(stepsPerDay)) {
      insertData('Steps', 'steps', date, steps);
    }
  });
};

export {initHealthKit, getSteps};

// export const handleHealthData = async (
//   dataType,
//   insertDataFunction,
//   setIsLoading,
//   setApiResponse,
//   setError,
//   setDataStatus,
// ) => {
//   setIsLoading(true);

//   try {
//     const results = await getSamples();

//     const dataPerDay = {};

//     results.forEach(entry => {
//       const date = new Date(entry.start).toDateString();
//       dataPerDay[date] = (dataPerDay[date] || 0) + entry.quantity;
//     });

//     for (const [date, data] of Object.entries(dataPerDay)) {
//       insertDataFunction(date, data);
//     }

//     setIsLoading(false);
//     setDataStatus(true);
//   } catch (e) {
//     console.log(e);
//     setApiResponse('Something went wrong.');
//     setError(e);
//     setIsLoading(false);
//     setDataStatus(false);

//     Alert.alert(
//       'Error',
//       `Failed to retrieve health data. Please try again. ${error}`,
//       [{text: 'OK', onPress: () => console.log('OK pressed')}],
//       {cancelable: false},
//     );
//   }
// };
