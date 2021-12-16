import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {phoneCall} from './communication';
import {fetchSingleLead} from './leads';
import {Platform} from 'react-native';
import {setNotificationData, setRemoteNotification} from '../redux/actions';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

export const taskNotification = (
  date: Date,
  phone: string,
  countryCode: string,
  notification: {title: string; message: string},
  leadId: string,
  uid: string,
) => {
  PushNotification.localNotificationSchedule({
    channelId: 'leads-channel',
    priority: 'max',
    importance: 'high',
    actions: ['Call'],
    title: notification.title,
    message: notification.message,
    userInfo: {phone, countryCode, leadId, uid},
    date: date,
    invokeApp: true,
    playSound: true,
    soundName: 'default',
    vibrate: true,
  });
};

const handleNotification = async (notification: any, dispatcher: any) => {
  // process the notification
  if (Platform.OS === 'android') {
    if (notification.action == 'Call') {
      phoneCall(
        notification.data.phone,
        notification.data.countryCode,
        notification.data.leadId,
        notification.data.uid,
      );
    }
  }
  if (notification.data.leadId === undefined) {
    dispatcher(setRemoteNotification(true));
    notification.finish(PushNotificationIOS.FetchResult.NoData);
    return;
  }
  const data = await fetchSingleLead(notification.data.leadId);
  const leadData = {
    id: notification.data.leadId,
    data,
  };
  dispatcher(setNotificationData(leadData));

  // (required) Called when a remote is received or opened, or local notification is opened
  notification.finish(PushNotificationIOS.FetchResult.NoData);
};

export const configureNotification = (dispatcher: any) => {
  PushNotification.popInitialNotification((notification) => {
    if (notification) {
      handleNotification(notification, dispatcher);
    }
  });

  PushNotification.createChannel(
    {
      channelId: 'leads-channel', // (required)
      channelName: 'Leads', // (required)
      playSound: true,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      // console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: (notification: any) =>
      handleNotification(notification, dispatcher),

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: false,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });
};

export const mapFollowUpToNotification = (type: string, userName: string) => {
  if (type === 'Call Back') {
    return {title: 'Call Back Alert', message: 'You have to call ' + userName};
  } else if (type == 'Meeting') {
    return {
      title: 'Meeting Alert',
      message: 'You have a meeting with ' + userName,
    };
  } else {
    return {
      title: 'Site Visit Alert',
      message: 'You have a site visit with ' + userName,
    };
  }
};

export const handleFCMToken = async (user: any, login: boolean) => {
  if (user.uid === undefined) {
    return;
  }
  let data = {};
  if (login) {
    const token = await messaging().getToken();
    data = {[user.uid]: token};
  } else {
    data = {[user.uid]: ''};
  }
  try {
    await firestore()
      .collection('fcmTokens')
      .doc(user.organization_id)
      .set(data, {merge: true});
  } catch (error) {
    console.log('Fcm token update error');
  }
};

export const sendLeadNotification = async (
  organization_id: string,
  uid: string,
  count: string,
) => {
  const funcData = JSON.stringify({
    organization_id: organization_id,
    notifications: {[uid]: count},
  });
  const result = await functions().httpsCallable('sendNotifications')(funcData);
};
