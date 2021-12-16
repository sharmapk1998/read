/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import firestore from '@react-native-firebase/firestore';

firestore().settings({cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!');
});

AppRegistry.registerComponent(appName, () => App);