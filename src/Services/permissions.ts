import {PermissionsAndroid} from 'react-native';
import Snackbar from 'react-native-snackbar';

export const permissionStorage = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'External Storage Write Permission',
      message: 'ReadPro needs access to Storage data ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    Snackbar.show({
      text: 'Storage Permission Required!',
      duration: Snackbar.LENGTH_SHORT,
    });
    return false;
  }
};

export const permissionContact = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      title: 'Read Contacts Permission',
      message: 'ReadPro needs access to contacts',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
};

export const permissionCallLog = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    {
      title: 'Call Log Permission',
      message: 'ReadPro needs access to your call logs',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    Snackbar.show({
      text: 'Please Grant Call Log Permission',
      duration: Snackbar.LENGTH_SHORT,
    });
    console.log('No permission');
    return false;
  }
};
