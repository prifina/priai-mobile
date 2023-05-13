import {useState} from 'react';
import AppleHealthKit from 'react-native-health';
import useDatabaseHooks from './useDatabaseHooks';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
};

const options = {
  startDate: new Date(2023, 0, 1).toISOString(),
  endDate: new Date().toISOString(),
};

const useHealthKitHooks = () => {
  const {insertData} = useDatabaseHooks();

  const initHealthKit = async () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, error => {
        if (error) {
          console.log('Permissions not granted!');
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  };

  const getSteps = async () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getSamples(options, (err, results) => {
        if (err) {
          console.log('Error getting steps data:', err);
          reject(err);
        } else {
          console.log('results', results);

          const stepsPerDay = {};

          results.forEach(entry => {
            const date = new Date(entry.start).toDateString();
            stepsPerDay[date] = (stepsPerDay[date] || 0) + entry.quantity;
          });

          for (const [date, steps] of Object.entries(stepsPerDay)) {
            insertData('Steps', 'steps', date, steps);
          }

          resolve(true);
        }
      });
    });
  };

  const getData = async dataType => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
        if (err) {
          console.log(`Error getting ${dataType} data:`, err);
          reject(err);
        } else {
          console.log('results', results);

          const dataPerDay = {};

          results.forEach(entry => {
            const date = new Date(entry.start).toDateString();
            dataPerDay[date] = (dataPerDay[date] || 0) + entry.quantity;
          });

          for (const [date, data] of Object.entries(dataPerDay)) {
            insertData(dataType, dataType.toLowerCase(), date, data);
          }

          resolve(true);
        }
      });
    });
  };

  return {initHealthKit, getData, getSteps};
};

export default useHealthKitHooks;
