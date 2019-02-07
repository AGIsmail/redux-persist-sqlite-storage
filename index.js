/**
 * SQLite store adaptor designed to use with redux-persist. This small piece of code can also be used
 * as an interface between application and SQLite storage. Functions signature are same as AsyncStorage.
 *
 * getItem(key);
 * setitem(key, value);
 * removeItem(key);
 * getAllKeys();
 * clear();
 *
 * All the method above returns Promise object.
 * Source: https://github.com/prsn/redux-persist-sqlite-storage/
 */

const noop = () => {};

const DB_CLOSED_MESSAGE =
  "SqliteStore: Operation is not allowed when DB is closed!";

export default function SQLiteStorage(SQLite = {}, config = {}) {
  const dbResolver = (() => {
    return new Promise((resolve, reject) => {
      const db = SQLite.openDatabase(config.name);

      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS store (key, value)",
          null,
          (_, { rows }) => {
            resolve(db);
          },
          err => {
            console.log("create table failure", err);
            reject();
          }
        );
      });
    });
  })();

  function getItem(key, cb = noop) {
    return new Promise((resolve, reject) => {
      dbResolver
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT value FROM store WHERE key=?",
              [key],
              (tx, rs) => {
                resolve(rs.rows._array[0].value);
                cb(null, rs.rows._array[0].value);
              },
              (tx, err) => {
                cb(err);
                reject("SqliteStore: unable to get value", err);
              }
            );
          });
        })
        .catch(() => {
          reject(DB_CLOSED_MESSAGE);
        });
    });
  }

  function setItem(key, value, cb = noop) {
    return new Promise((resolve, reject) => {
      dbResolver
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT count(*) as count FROM store WHERE key=?",
              [key],
              (tx, rs) => {
                if (rs.rows.item(0).count == 1) {
                  tx.executeSql(
                    "UPDATE store SET value=? WHERE key=?",
                    [value, key],
                    () => {
                      resolve(value);
                    },
                    (tx, err) => reject("SqliteStore: unable to set value", err)
                  );
                } else {
                  tx.executeSql(
                    "INSERT INTO store VALUES (?,?)",
                    [key, value],
                    () => {
                      resolve(value);
                    },
                    (tx, err) => {
                      reject("SqliteStore: unable to set value", err);
                    }
                  );
                }
              },
              err => console.log("setitems err", err)
            );
          });
        })
        .catch(() => {
          reject(DB_CLOSED_MESSAGE);
        });
    });
  }

  function removeItem(key, cb = noop) {
    return new Promise((resolve, reject) => {
      dbResolver
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "DELETE FROM store WHERE key=?",
              [key],
              () => {
                resolve(`${key} removed from store`);
                cb(null, `${key} removed from store`);
              },
              (tx, err) => {
                reject("SqliteStore: unable to remove key", err);
                cb(err, "SqliteStore: unable to remove key");
              }
            );
          });
        })
        .catch(() => {
          reject(DB_CLOSED_MESSAGE);
        });
    });
  }

  function getAllKeys(cb = noop) {
    return new Promise((resolve, reject) => {
      dbResolver
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM store",
              [],
              (tx, rs) => {
                const result = [];
                for (let i = 0, il = rs.rows.length; i < il; i++) {
                  result.push(rs.rows.item(i).key);
                }
                resolve(result);
                cb(null, result);
              },
              (tx, err) => {
                resolve([]);
                cb(null, []);
              }
            );
          });
        })
        .catch(() => {
          reject(DB_CLOSED_MESSAGE);
        });
    });
  }

  function clear(cb = noop) {
    return new Promise((resolve, reject) => {
      dbResolver
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "DELETE FROM store",
              [],
              () => {
                resolve(null);
                cb(null);
              },
              (tx, err) => {
                reject(err);
                cb(err);
              }
            );
          });
        })
        .catch(() => {
          reject(DB_CLOSED_MESSAGE);
        });
    });
  }

  return {
    getItem,
    setItem,
    removeItem,
    getAllKeys,
    clear
  };
}
