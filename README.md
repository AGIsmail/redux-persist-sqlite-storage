# redux-persist-sqlite-storage (Expo-Compatible)

A redux-persist store adaptor which uses SQLite database to persist store.
This version of [prsn's solution](https://github.com/prsn/redux-persist-sqlite-storage) has been modified to work with the [Expo SQLite module](https://docs.expo.io/versions/latest/sdk/sqlite/).

**This has only been tested on Android.**

# Motivation

Redux-persist uses `AsyncStorage` as the default storage engine in react-native. This is a drop-in replacemet of `AsyncStorage`.

The library is inspired by `react-native-sqlite-storage`.

# Install
```bash
npm install --save https://github.com/AGIsmail/redux-persist-sqlite-storage
```

# Usages


```Javascript
import { SQLite } from "expo"; // Use the Expo sqlite module
import SQLiteStorage from 'redux-persist-sqlite-storage';

// Give the sql db a name
const sqliteConfig = {
	name: "notes-store"
};

// Pass any valid configuration as `config` parameter applied to react-native-sqlite-storage as per above link
const storeEngine = SQLiteStorage(SQLite, sqliteConfig);

// Now pass the storeEngine as value of store while configuring redux-persist

const persistConfig = {
  ...
  store: storeEngine
}

```

The object returned by the `SQLiteStorage` function has 5 methods.
Each method returns a `Promise` and a callback function (compatible with redux-persist 5.x.x version)

The following functions are supported

```Javascript
getItem(key: string, [callback]: ?(error: ?Error, result: ?string) => void)
```
```Javascript
setitem(key: string, value: string, [callback]: ?(error: ?Error) => void)
```
```Javascript
removeItem(key: string, [callback]: ?(error: ?Error) => void)
```
```Javascript
getAllKeys([callback]: ?(error: ?Error, keys: ?Array<string>) => void)
```
```Javascript
clear([callback]: ?(error: ?Error) => void)
```

Above methods conform to the `AsyncStorage` method signatures.

# Tested under following environments

This code is currently running in an application using `redux-persist@5.10.0` on Android without any reported issues.


# Future enhancements
Will support all of the methods supported by AsyncStorage.
