import React, {FunctionComponent} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {widthToDp} from '../values/size';

type props = {
  color: string;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  width: any;
  size?: any;
};

const CustomButton: FunctionComponent<props> = ({
  color,
  title,
  onPress,
  style,
  width,
  size,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles(color).buttonParent, {width: width}, style]}>
      <Text style={[styles(color).text, {fontSize: size}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = (color: string) =>
  StyleSheet.create({
    buttonParent: {
      paddingVertical: 5,
      borderColor: color,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: color,
    },
  });
export default CustomButton;
