import auth, {firebase} from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import {emailValidate, passwordValidate} from '../values/validators';
import firestore from '@react-native-firebase/firestore';
import {
  clearAnalytics,
  clearUserState,
  setFreshLeads,
  updateUser,
} from '../redux/actions';
import functions from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import {setUsersList} from './user';
import {handleFCMToken} from './notification';

export const signInFireBase = (
  email: string,
  pass: string,
  setLoad: (value: boolean) => void,
  dispatcher: any,
  navigation: any,
) => {
  let check = emailValidate(email);
  if (check.length == 0) {
    check = passwordValidate(pass);
  }
  if (check.length == 0) {
    setLoad(true);
    auth()
      .signInWithEmailAndPassword(email, pass)
      .then(async (userCredential) => {
        setLoad(false);
        await checkUser(navigation, dispatcher);
      })
      .catch((error) => {
        let errorMsg = '';
        console.log('Sign In Error', error);
        if (error.code == 'auth/wrong-password') {
          errorMsg = 'Invalid Password';
        } else if (error.code == 'auth/user-not-found') {
          errorMsg = 'User Not Found';
        } else {
          errorMsg = 'Error! Try Again';
        }
        setLoad(false);
        setTimeout(
          () =>
            Snackbar.show({text: errorMsg, duration: Snackbar.LENGTH_SHORT}),
          50,
        );
      });
  } else {
    Snackbar.show({text: check, duration: Snackbar.LENGTH_SHORT});
  }
};

export const resetPassword = (
  email: string,
  setLoad: (value: boolean) => void,
) => {
  const check = emailValidate(email);
  if (check.length == 0) {
    setLoad(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setLoad(false);
        setTimeout(
          () =>
            Alert.alert(
              'Reset Mail Sent',
              'Password reset information have been sent on you registered email id',
              [
                {
                  text: 'Okay',
                  onPress: () => {
                    return;
                  },
                },
              ],
            ),
          50,
        );
      })
      .catch((error) => {
        let errorMsg = '';
        if (error.code == 'auth/user-not-found') {
          errorMsg = 'Error! User Not Exist';
        } else {
          errorMsg = 'Error! Try Again';
        }
        console.log('forget error', error);
        setLoad(false);
        setTimeout(
          () =>
            Snackbar.show({
              text: errorMsg,
              duration: Snackbar.LENGTH_SHORT,
            }),
          50,
        );
      });
  } else {
    Snackbar.show({text: check, duration: Snackbar.LENGTH_SHORT});
  }
};

export const checkUser = async (navigation: any, dispatcher: any) => {
  const user = auth().currentUser;
  try {
    if (user) {
      const result = await user.getIdTokenResult();
      if (
        result.claims.firstLogin === undefined ||
        result.claims.firstLogin === true
      ) {
        navigation.replace('ChangePass');
        return;
      } else {
        dispatcher(updateUser({uid: user.uid, role: result.claims.role}));
        navigation.replace('Home');
      }
    } else {
      await auth().signOut();
      navigation.replace('Auth');
    }
  } catch (error) {
    console.log('sign in error', error);
    navigation.replace('Auth');
  }
};

export const handleUser = (user: any, navigation: any, dispatcher: any) => {
  const subscriber = firestore()
    .collection('users')
    .doc(user.uid)
    .onSnapshot((userData) => {
      if (userData === null) {
        return;
      }
      const data = userData.data();
      if (data) {
        dispatcher(updateUser(data));
        setUsersList({...user, ...data}, dispatcher);
        if (data.status === 'INACTIVE') {
          signOutFirebase(data.uid, navigation, dispatcher);
          Alert.alert('Inactive User', 'Please Contact Your Admin', [
            {
              text: 'Okay',
              onPress: () => {
                return;
              },
            },
          ]);
        } else {
          if (data.device_id === undefined || data.device_id === '') {
            updateLoginStatus(data, getUniqueId());
            handleFCMToken(data, true);
          } else if (data.device_id !== getUniqueId()) {
            navigation.replace('Auth');
            Alert.alert(
              'Already Signed In',
              'User is Logged in Another Device',
              [
                {
                  text: 'Okay',
                  onPress: () => {
                    return;
                  },
                },
                {
                  text: 'Use Here',
                  onPress: () => {
                    updateLoginStatus(data, getUniqueId());
                    handleFCMToken(data, true);
                    navigation.replace('Home');
                  },
                },
              ],
            );
          }
        }
      }
    });
  return subscriber;
};

export const signOut = async (
  uid: string,
  navigation: any,
  dispatcher: any,
) => {
  Alert.alert('Log Out', 'Do you want to log out?', [
    {
      text: 'Cancel',
      onPress: () => {
        return;
      },
      style: 'cancel',
    },
    {
      text: 'Confirm',
      onPress: async () => {
        await signOutFirebase(uid, navigation, dispatcher);
      },
    },
  ]);
};

const signOutFirebase = async (user: any, navigation: any, dispatcher: any) => {
  dispatcher(clearAnalytics());
  dispatcher(setFreshLeads(undefined));
  navigation.replace('Auth');
  await updateLoginStatus(user, '');
  await handleFCMToken(user, false);
  auth().signOut();
  AsyncStorage.clear();
  dispatcher(clearUserState());
};

export const changePasswordFirebase = (
  pass: string,
  navigation: any,
  setLoad: (value: boolean) => void,
) => {
  setLoad(true);
  const user = auth().currentUser;
  user
    ?.updatePassword(pass)
    .then(() => {
      functions()
        .httpsCallable('setFirstLogin')()
        .then(() => {
          Snackbar.show({
            text: 'Password Updated!!',
            duration: Snackbar.LENGTH_SHORT,
          });
          auth()
            .signOut()
            .then(() => {
              setLoad(false);
              navigation.replace('Auth');
            });
        });
    })
    .catch((error) => {
      setLoad(false);
      console.log('password reset error', error);
      auth().signOut();
      Snackbar.show({
        text: 'Login Again to Reset Password',
        duration: Snackbar.LENGTH_SHORT,
      });
      navigation.replace('Auth');
    });
};

const updateLoginStatus = async (user: any, device_id: String) => {
  try {
    if (user?.uid) {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({device_id}, {merge: true});
    }
  } catch (error) {
    console.log('login status change error');
  }
};
