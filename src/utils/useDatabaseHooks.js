import {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

const useDatabaseHooks = () => {
  const db = SQLite.openDatabase({
    name: 'database.db',
    createFromLocation: 1,
    location: 'default',
  });

  useEffect(() => {
    createTable('Steps', 'steps');
    createTable('Calories', 'calories');
  }, []);

  const createTable = (tableName, columnName) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, ${columnName} INTEGER);`,
      );
    });
  };

  const insertData = (tableName, columnName, date, value) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${tableName} (date, ${columnName}) VALUES (?,?)`,
        [date, value],
      );
    });
  };

  const retrieveData = (tableName, callback) => {
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName}`, [], (tx, results) => {
        let data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        callback(data);
      });
    });
  };

  const calculateAverage = (
    tableName,
    columnName,
    startDate,
    endDate,
    callback,
  ) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT AVG(${columnName}) as average FROM ${tableName} WHERE date BETWEEN ? AND ?`,
        [startDate.getTime(), endDate.getTime()],
        (tx, results) => {
          callback(results.rows.item(0).average);
        },
      );
    });
  };

  return {
    createTable,
    insertData,
    retrieveData,
    calculateAverage,
  };
};

export default useDatabaseHooks;

// import {useEffect} from 'react';
// import SQLite from 'react-native-sqlite-storage';

// const useDatabaseHooks = () => {
//   const db = SQLite.openDatabase({
//     name: 'database.db',
//     createFromLocation: 1,
//     location: 'default',
//   });

//   useEffect(() => {
//     createTable();
//   }, []);

//   const createTable = () => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS Steps (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, steps INTEGER);',
//       );
//     });
//   };

//   const insertSteps = (date, steps) => {
//     db.transaction(tx => {
//       tx.executeSql('INSERT INTO Steps (date, steps) VALUES (?,?)', [
//         date,
//         steps,
//       ]);
//     });
//   };

//   const retrieveSteps = callback => {
//     db.transaction(tx => {
//       tx.executeSql('SELECT * FROM Steps', [], (tx, results) => {
//         let steps = [];
//         for (let i = 0; i < results.rows.length; i++) {
//           steps.push(results.rows.item(i));
//         }
//         callback(steps);
//       });
//     });
//   };

//   const calculateAverageSteps = (startDate, endDate, callback) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT AVG(steps) as average FROM Steps WHERE date BETWEEN ? AND ?',
//         [startDate.getTime(), endDate.getTime()],
//         (tx, results) => {
//           callback(results.rows.item(0).average);
//         },
//       );
//     });
//   };

//   ////calories

//   const createCaloriesTable = () => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS Calories (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, calories INTEGER);',
//       );
//     });
//   };

//   const insertCalories = (date, calories) => {
//     db.transaction(tx => {
//       tx.executeSql('INSERT INTO Calories (date, calories) VALUES (?,?)', [
//         date,
//         calories,
//       ]);
//     });
//   };

//   const retrieveCalories = callback => {
//     db.transaction(tx => {
//       tx.executeSql('SELECT * FROM Calories', [], (tx, results) => {
//         let calories = [];
//         for (let i = 0; i < results.rows.length; i++) {
//           calories.push(results.rows.item(i));
//         }
//         callback(calories);
//       });
//     });
//   };

//   const calculateAverageCalories = (startDate, endDate, callback) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT AVG(calories) as average FROM Calories WHERE date BETWEEN ? AND ?',
//         [startDate.getTime(), endDate.getTime()],
//         (tx, results) => {
//           callback(results.rows.item(0).average);
//         },
//       );
//     });
//   };

//   return {
//     createTable,
//     insertSteps,
//     retrieveSteps,
//     calculateAverageSteps,
//     createCaloriesTable,
//     insertCalories,
//     retrieveCalories,
//     calculateAverageCalories,
//   };
// };

// export default useDatabaseHooks;
