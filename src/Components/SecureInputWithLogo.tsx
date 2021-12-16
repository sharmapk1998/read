import React, {FunctionComponent, useState} from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {heightToDp, widthToDp} from '../values/size';
import theme from '../values/theme';

type props = {
  shadow: boolean;
  logo: string;
  inputProps: TextInputProps;
  style?: ViewStyle;
  validator: (value: string) => string;
};

const SecureInputWithLogo = React.forwardRef(
  ({style, logo, inputProps, shadow, validator}: props, ref) => {
    const [showPass, setShowPass] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    return (
      <>
        <View
          style={
            shadow
              ? [styles.container, styles.shadow, style]
              : [styles.container, style]
          }>
          <Icons
            name={logo}
            color={theme.colors.GREY_LIGHT}
            size={widthToDp(5.5)}
            style={styles.icon}
          />
          <TextInput
            //@ts-ignore
            ref={ref}
            {...inputProps}
            style={styles.textInput}
            secureTextEntry={showPass ? false : true}
            placeholderTextColor={theme.colors.PLACEHOLDER}
            onBlur={() => {
              if (inputProps.value) {
                setErrorMsg(validator(inputProps.value));
              }
            }}
          />
          <Icons
            color={theme.colors.GREY_LIGHT}
            size={widthToDp(5.1)}
            style={styles.showIcon}
            onPress={() => setShowPass(!showPass)}
            name={showPass ? 'eye' : 'eye-off'}
          />
        </View>
        {errorMsg.length != 0 && <Text style={styles.error}>{errorMsg}</Text>}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: widthToDp(5),
  },
  icon: {
    marginRight: 10,
  },
  showIcon: {
    marginLeft: 'auto',
  },
  textInput: {
    padding: 0,
    fontSize: widthToDp(4),
    paddingVertical: 10,
    width: '78%',
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  error: {
    marginTop: 5,
    fontSize: widthToDp(3.5),
    color: theme.colors.ERROR,
  },
});

export default SecureInputWithLogo;
