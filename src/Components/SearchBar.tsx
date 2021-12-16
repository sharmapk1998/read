import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../values/theme';

type props = {
  style?: ViewStyle;
  shadow: boolean;
  inputProps: TextInputProps;
  onSearch: () => void;
};

const SearchBar: FunctionComponent<props> = ({
  style,
  shadow,
  inputProps,
  onSearch,
}) => {
  return (
    <View
      style={
        shadow ? [styles.parent, styles.shadow, style] : [styles.parent, style]
      }>
      <TextInput
        style={styles.textInput}
        placeholder={'Search Client Name or Mobile No.'}
        placeholderTextColor={theme.colors.PLACEHOLDER}
        {...inputProps}
      />
      <View style={styles.line} />
      <TouchableOpacity onPress={onSearch}>
        <Icon name={'search'} size={25} color={theme.nav_colors.PRIMARY} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textInput: {
    width: '83%',
  },
  line: {
    height: '60%',
    width: 1,
    backgroundColor: theme.colors.GREY_LIGHT,
  },
});

export default SearchBar;
