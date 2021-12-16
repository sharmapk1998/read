import React, {FunctionComponent} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import theme from '../values/theme';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

type props = {
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  title?: string;
};

const SubmitButton: FunctionComponent<props> = ({
  onPress,
  style,
  textStyle,
  title,
}) => {
  return (
    // <HideWithKeyboard>
    <TouchableOpacity style={[styles.submitButton, style]} onPress={onPress}>
      <Text style={[styles.submitText, textStyle]}>
        {title ? title : 'Submit'}
      </Text>
    </TouchableOpacity>
    // </HideWithKeyboard>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 45,
    backgroundColor: theme.nav_colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf:"center",
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
  },
});

export default SubmitButton;
