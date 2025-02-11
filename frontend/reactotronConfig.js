import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// eslint-disable-next-line no-console
console.log('reactotron config');

let reactotron = Reactotron.configure({}) // controls connection & communication settings
  .useReactNative();

reactotron.setAsyncStorageHandler &&
  reactotron.setAsyncStorageHandler(AsyncStorage);

reactotron.connect();
