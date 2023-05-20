import {useState} from 'react';
import AppleHealthKit from 'react-native-health';
import useDatabaseHooks from './useDatabaseHooks';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
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

  const getCalories = async () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
        if (err) {
          console.log('Error getting calories data:', err);
          reject(err);
        } else {
          console.log('calories results', results);

          const caloriesPerDay = {};

          results.forEach(entry => {
            const date = new Date(entry.startDate).toDateString();
            caloriesPerDay[date] = (caloriesPerDay[date] || 0) + entry.value;
          });

          for (const [date, calories] of Object.entries(caloriesPerDay)) {
            insertData('Calories', 'calories', date, calories);
            console.log('success', date, calories);
          }

          resolve(true);
        }
      });
    });
  };

  const getDistance = async () => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDistanceWalkingRunningSamples(
        {...options, unit: 'meter'},
        (err, results) => {
          if (err) {
            console.log('Error getting distance data:', err);
            reject(err);
          } else {
            console.log('distance results', results);

            const distancePerDay = {};

            results.forEach(entry => {
              const date = new Date(entry.startDate).toDateString();
              distancePerDay[date] = (distancePerDay[date] || 0) + entry.value;
            });

            for (const [date, distance] of Object.entries(distancePerDay)) {
              insertData('Distance', 'distance', date, distance);
              console.log('success', date, distance);
            }

            resolve(true);
          }
        },
      );
    });
  };

  const getData = async dataType => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        {
          ...options,
          type: dataType,
        },
        (err, results) => {
          if (err) {
            console.log(`Error getting ${dataType} data:`, err);
            reject(err);
          } else {
            console.log('results', results);

            const dataPerDay = {};

            results.forEach(entry => {
              const date = new Date(entry.start).toDateString();
              dataPerDay[date] = (dataPerDay[date] || 0) + entry.value;
            });

            for (const [date, data] of Object.entries(dataPerDay)) {
              insertData(dataType, dataType.toLowerCase(), date, data);
            }

            resolve(true);
          }
        },
      );
    });
  };

  return {initHealthKit, getData, getSteps, getCalories, getDistance};
};

export default useHealthKitHooks;

// CHECK THIS
// import { useState } from 'react';
// import AppleHealthKit from 'react-native-health';
// import useDatabaseHooks from './useDatabaseHooks';

// const permissions = {
//   permissions: {
//     read: [
//       AppleHealthKit.Constants.Permissions.StepCount,
//       AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
//     ],
//   },
// };

// const options = {
//   startDate: new Date(2023, 0, 1).toISOString(),
//   endDate: new Date().toISOString(),
// };

// const useHealthKitHooks = () => {
//   const { insertData } = useDatabaseHooks();

//   const initHealthKit = async () => {
//     return new Promise((resolve, reject) => {
//       AppleHealthKit.initHealthKit(permissions, (err, results) => {
//         if (err) {
//           console.log('Permissions not granted!');
//           reject(err);
//         } else {
//           resolve(true);
//         }
//       });
//     });
//   };

//   const getSteps = async () => {
//     return new Promise((resolve, reject) => {
//       AppleHealthKit.getSamples(
//         {
//           ...options,
//           type: 'Steps',
//         },
//         (err, results) => {
//           if (err) {
//             console.log('Error getting steps data:', err);
//             reject(err);
//           } else {
//             console.log('results', results);

//             const stepsPerDay = {};

//             results.forEach(entry => {
//               const date = new Date(entry.startDate).toDateString();
//               stepsPerDay[date] = (stepsPerDay[date] || 0) + entry.quantity;
//             });

//             for (const [date, steps] of Object.entries(stepsPerDay)) {
//               insertData('Steps', 'steps', date, steps);
//             }

//             resolve(true);
//           }
//         }
//       );
//     });
//   };

//   const getData = async dataType => {
//     return new Promise((resolve, reject) => {
//       AppleHealthKit.getSamples(
//         {
//           ...options,
//           type: dataType,
//         },
//         (err, results) => {
//           if (err) {
//             console.log(`Error getting ${dataType} data:`, err);
//             reject(err);
//           } else {
//             console.log('results', results);

//             const dataPerDay = {};

//             results.forEach(entry => {
//               const date = new Date(entry.startDate).toDateString();
//               dataPerDay[date] = (dataPerDay[date] || 0) + entry.quantity;
//             });

//             for (const [date, data] of Object.entries(dataPerDay)) {
//               insertData(dataType, dataType.toLowerCase(), date, data);
//             }

//             resolve(true);
//           }
//         }
//       );
//     });
//   };

//   return { initHealthKit, getData, getSteps };
// };

// export default useHealthKitHooks;
