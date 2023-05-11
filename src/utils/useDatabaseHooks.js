import {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

const useDatabaseHooks = () => {
  const db = SQLite.openDatabase({
    name: 'database.db',
    createFromLocation: 1,
    location: 'default',
  });

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Steps (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, steps INTEGER);',
      );
    });
  };

  const insertSteps = (date, steps) => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO Steps (date, steps) VALUES (?,?)', [
        date,
        steps,
      ]);
    });
  };

  const retrieveSteps = callback => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Steps', [], (tx, results) => {
        let steps = [];
        for (let i = 0; i < results.rows.length; i++) {
          steps.push(results.rows.item(i));
        }
        callback(steps);
      });
    });
  };

  const calculateAverageSteps = (startDate, endDate, callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT AVG(steps) as average FROM Steps WHERE date BETWEEN ? AND ?',
        [startDate.getTime(), endDate.getTime()],
        (tx, results) => {
          callback(results.rows.item(0).average);
        },
      );
    });
  };

  return {createTable, insertSteps, retrieveSteps, calculateAverageSteps};
};

export default useDatabaseHooks;
