import {Linking, Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
//@ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {selectContactPhone} from 'react-native-select-contact';
import {permissionCallLog, permissionContact} from '../Services/permissions';
//@ts-ignore
import CallLogs from 'react-native-call-log';
//@ts-ignore
import CallDetectorManager from 'react-native-call-detection';
import {secToTime} from './format';
import {createCallLogFirebase} from './resources';

export const phoneCall = async (
  phoneNo: string,
  countryCode: string | undefined,
  leadId: string,
  user: any,
) => {
  if (countryCode === undefined) {
    countryCode = '+91';
  }
  checkCallState(leadId, user);
  try {
    if (Platform.OS === 'android') {
      if (await permissionCallLog()) {
        RNImmediatePhoneCall.immediatePhoneCall(countryCode + phoneNo);
      }
    } else {
      RNImmediatePhoneCall.immediatePhoneCall(countryCode + phoneNo);
    }
  } catch (error) {
    console.log('call error', error);
    Snackbar.show({
      text: 'Unable to call',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};

export const whatsappOpen = (phoneNo: string, countryCode: string) => {
  if (countryCode === undefined) {
    countryCode = '91';
  } else {
    countryCode = countryCode.slice(1);
  }
  const link =
    'whatsapp://send?text=' +
    '' +
    '&phone=' +
    countryCode +
    phoneNo.substring(phoneNo.length - 10);
  console.log(link);
  Linking.canOpenURL(link).then(async (supported) => {
    if (supported) {
      try {
        await Linking.openURL(link);
      } catch (error) {
        console.log('Open whatsapp error - ', error);
        Snackbar.show({
          text: 'Unable to open whatsapp',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      console.log('Whatsapp not supported');
      Snackbar.show({
        text: 'Unable to open whatsapp',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  });
};

export const mailOpen = (mailid: string) => {
  const link = `mailto:${mailid}`;
  Linking.canOpenURL(link).then(async (supported) => {
    if (supported) {
      try {
        await Linking.openURL(link);
      } catch (error) {
        console.log('Open massage error');
        Snackbar.show({
          text: 'Unable to open mail app',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      console.log('Open massage error');
      Snackbar.show({
        text: 'Unable to open mail app',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  });
};

export const readContacts = async (
  user: any,
  navigation: any,
  hide: () => void,
) => {
  if (
    (Platform.OS == 'android' && (await permissionContact())) ||
    Platform.OS == 'ios'
  ) {
    selectContactPhone()
      .then(async (selection) => {
        if (!selection) {
          console.log('No Contact');
        } else {
          let {contact, selectedPhone} = selection;
          hide();
          let name = contact.name.split(' ');
          navigation.navigate('AddContact', {
            data: {
              firstName: name[0],
              lastName: name.slice(1).join(' '),
              phone: selectedPhone.number.replace(/\D/g, ''),
              country_code: '+91',
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        hide();
      });
  }
};

export const checkCallState = (leadId: string, user: any) => {
  let callStartTime: Date = new Date();
  let connected = false;
  const listner = new CallDetectorManager(
    async (event: any, phoneNumber: any) => {
      if (event === 'Disconnected') {
        if (Platform.OS === 'android') {
          if (await permissionCallLog()) {
            setTimeout(() => {
              CallLogs.load(1, {}).then((c: any) => {
                const timeString = secToTime(Math.floor(c[0].duration));
                createCallLogFirebase(leadId, user, timeString, callStartTime);
              });
            }, 1000);
          }
        } else if (Platform.OS === 'ios') {
          let timeString: string;
          if (connected) {
            let currentTime = new Date();
            let callTime = currentTime.getTime() - callStartTime.getTime();
            timeString = secToTime(Math.floor(callTime / 1000));
          } else {
            timeString = '00:00';
          }
          createCallLogFirebase(leadId, user, timeString, callStartTime);
        }
        listner.dispose();
        console.log('Disconnected Call');
      } else if (event === 'Connected') {
        connected = true;
        console.log('Connected Call');
      } else if (event === 'Dialing') {
        callStartTime = new Date();
      }
    },
    false,
    () => {
      console.log('error');
    },
    {
      title: 'Phone State Permission',
      message:
        'ReadPro needs access to your phone state in order to update call logs',
    },
  );
};
