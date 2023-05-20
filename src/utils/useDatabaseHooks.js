import {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

const useDatabaseHooks = () => {
  const db = SQLite.openDatabase(
    {
      name: 'priai-database.db',
      createFromLocation: 1,
      location: 'default',
    },
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.log('Error opening database:', error);
    },
  );

  // console.log('db', db);

  const deleteTable = tableName => {
    db.transaction(tx => {
      tx.executeSql(
        `DROP TABLE IF EXISTS ${tableName}`,
        [],
        (_, result) => {
          console.log('Table deleted successfully', result);
        },
        (_, error) => {
          console.log('Error deleting table:', error);
        },
      );
    });
  };

  useEffect(() => {
    // deleteTable('Calories');
    // deleteTable('Distance');
    // deleteTable('Steps');
    createTable('Steps', 'steps');
    createTable('Calories', 'calories');
    createTable('Distance', 'distance');
  }, []);

  const createTable = (tableName, columnName) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, ${columnName} REAL);`,
      );
    });
  };
  const insertData = (tableName, columnName, date, value) => {
    const roundedValue = value.toFixed(2);

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${tableName} (${columnName}, date) VALUES (?, ?)`,
        [roundedValue, date],
        (_, result) => {
          console.log('Data inserted successfully', result);
        },
        (_, error) => {
          console.log('Error inserting data:', error);
          console.log('Error message:', error.message);
        },
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
    deleteTable,
    insertData,
    retrieveData,
    calculateAverage,
  };
};

export default useDatabaseHooks;
