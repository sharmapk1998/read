import React, {useState, FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import InputWithLogo from '../Components/InputWithLogo';
import Loader from '../Components/Modals/Loader';
import {resetPassword} from '../Services/auth';
import {heightToDp, widthToDp} from '../values/size';
import theme from '../values/theme';
import {emailValidate} from '../values/validators';

const {height, width} = Dimensions.get('window');

type props = {
  navigation: any;
};

const ForgetPass: FunctionComponent<props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [load, setLoad] = useState(false);
  const changeLoad = (value: boolean) => {
    setLoad(value);
  };

  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={'position'} style={styles.avoidingView}>
          <Image
            source={require('../../assets/app-logo.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <View style={styles.headTextContainer}>
            <Text style={styles.headText1}>Forget Password?</Text>
            <Text style={styles.headText2}>
              Enter your registered email below to recieve password reset
              instruction
            </Text>
          </View>
          <Image
            source={require('../../assets/mail.png')}
            style={styles.emailImage}
            resizeMode="contain"
          />
          <View style={styles.inputContainer}>
            <InputWithLogo
              shadow
              logo={'mail'}
              inputProps={{
                returnKeyType: 'next',
                placeholder: 'Email',
                value: email,
                onChangeText: (value) => setEmail(value),
                onSubmitEditing: Keyboard.dismiss,
              }}
              validator={emailValidate}
              style={{borderRadius: 5}}
            />
            <TouchableOpacity
              style={{marginTop: '4%'}}
              onPress={() => navigation.pop()}>
              <Text style={styles.forgetText}>
                <Text style={{color: theme.colors.GREY}}>
                  Remember Password?{' '}
                </Text>
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => resetPassword(email, changeLoad)}>
            <Text style={styles.loginText}>Send</Text>
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
      </View>
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
    marginTop: '7%',
  },
  headText1: {
    textAlign: 'center',
    fontSize: widthToDp(5.5),
    fontWeight: 'bold',
  },
  headText2: {
    alignSelf: 'center',
    width: '80%',
    marginTop: 5,
    textAlign: 'center',
    fontSize: widthToDp(4),
    color: theme.colors.GREY,
  },
  emailImage: {
    alignSelf: 'center',
    marginTop: '12%',
    height: '16%',
  },
  inputContainer: {
    marginTop: '12%',
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
    width: '100%',
    textAlign: 'center',
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

export default ForgetPass;
