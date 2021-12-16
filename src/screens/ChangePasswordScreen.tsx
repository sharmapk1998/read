import React, {useState, useRef, FunctionComponent, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import Loader from '../Components/Modals/Loader';
import SecureInputWithLogo from '../Components/SecureInputWithLogo';
import {changePasswordFirebase} from '../Services/auth';
import {heightToDp, widthToDp} from '../values/size';
import theme from '../values/theme';
import {emailValidate, passwordValidate} from '../values/validators';
const {height, width} = Dimensions.get('window');

type props = {
  navigation: any;
  route: any;
};

const ChangePasswordScreen: FunctionComponent<props> = ({
  navigation,
  route,
}) => {
  const passRef = useRef();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [load, setLoad] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  const focusPass = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      //@ts-ignore
      passRef.current.focus();
    }, 150);
  };
  const onSubmit = () => {
    if (pass !== confirmPass) {
      Snackbar.show({
        text: "Password doesn't Match",
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      changePasswordFirebase(pass, navigation, (value: boolean) =>
        setLoad(value),
      );
    }
  };
  return (
    <>
      <ImageBackground
        source={require('../../assets/signin-bg.png')}
        style={styles.container}
        imageStyle={styles.imgBg}
        resizeMode="contain">
        <KeyboardAvoidingView behavior={'position'} style={styles.avoidingView}>
          <Image
            source={require('../../assets/app-logo.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <View style={styles.headTextContainer}>
            <Text style={styles.headText1}>Welcome,</Text>
            <Text style={styles.headText2}>Change Password To Continue</Text>
          </View>

          <View style={styles.inputContainer}>
            <SecureInputWithLogo
              shadow
              ref={passRef}
              logo={'lock-closed'}
              inputProps={{
                placeholder: 'New Password',
                value: pass,
                onChangeText: (value) => setPass(value),
                onSubmitEditing: () => focusPass,
              }}
              validator={passwordValidate}
              style={{marginTop: '7%', borderRadius: 5}}
            />
            <SecureInputWithLogo
              shadow
              ref={passRef}
              logo={'lock-closed'}
              inputProps={{
                placeholder: 'Confirm New Password',
                value: confirmPass,
                onChangeText: (value) => setConfirmPass(value),
                onSubmitEditing: () => Keyboard.dismiss(),
              }}
              validator={passwordValidate}
              style={{marginTop: '7%', borderRadius: 5}}
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={onSubmit}>
            <Text style={styles.loginText}>Update Password</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>from</Text>
          <Image
            style={styles.ifuLogo}
            source={require('../../assets/ifu-logo.png')}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
      {load === true && <Loader show={load} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imgBg: {
    height: '100%',
    opacity: 0.1,
  },
  avoidingView: {
    flex: 1,
    width: '100%',
  },
  appLogo: {
    height: heightToDp(5),
    width: widthToDp(32),
    marginTop: '25%',
    alignSelf: 'center',
  },
  headTextContainer: {
    marginTop: '10%',
  },
  headText1: {
    textAlign: 'center',
    fontSize: widthToDp(7),
    fontWeight: 'bold',
  },
  headText2: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: widthToDp(4.5),
    color: theme.colors.GREY,
  },

  inputContainer: {
    marginTop: '15%',
    paddingHorizontal: '8%',
  },
  forgetText: {
    color: theme.colors.PRIMARY_LIGHT,
    fontWeight: 'bold',
  },
  loginButton: {
    alignSelf: 'center',
    marginTop: '15%',
    width: '80%',
    backgroundColor: theme.colors.PRIMARY,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  bottomContainer: {
    marginTop: 'auto',
    marginBottom: '12%',
  },
  bottomText: {
    textAlign: 'center',
    color: theme.colors.GREY,
    fontSize: 18,
  },
  ifuLogo: {
    height: heightToDp(7),
  },
});

export default ChangePasswordScreen;
