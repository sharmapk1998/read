import React, {useState} from 'react';
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
  validator?: (value: string) => string;
  fontSize?: number;
};

const InputWithLogo = React.forwardRef(
  ({shadow, logo, inputProps, style, validator, fontSize}: props, ref) => {
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
            size={fontSize ? fontSize * 1.5 : widthToDp(5.5)}
            style={styles.icon}
          />
          <TextInput
            //@ts-ignore
            ref={ref}
            {...inputProps}
            placeholderTextColor={theme.colors.PLACEHOLDER}
            onBlur={() => {
              if (inputProps.value) {
                if (validator) {
                  setErrorMsg(validator(inputProps.value));
                }
              }
            }}
            style={[styles.textInput, {fontSize: fontSize}]}
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
  textInput: {
    padding: 0,
    fontSize: 14,
    paddingVertical: 12,
    width: '90%',
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
    fontSize: 12,
    color: theme.colors.ERROR,
  },
});

export default InputWithLogo;
