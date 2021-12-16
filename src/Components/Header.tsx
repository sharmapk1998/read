import React, {FunctionComponent, ReactChild} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {heightToDp, widthToDp} from '../values/size';
import theme from '../values/theme';
type props = {
  onBack: () => void;
  title: string;
  children?: ReactChild | boolean;
};
const Header: FunctionComponent<props> = ({onBack, title, children}) => {
  return (
    <View style={styles.parent}>
      <TouchableOpacity onPress={onBack}>
        <Icon
          name={'arrow-back-outline'}
          color={'#fff'}
          size={widthToDp(7.5)}
        />
      </TouchableOpacity>
      <Text style={styles.heading} numberOfLines={1}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: theme.nav_colors.PRIMARY,
    height: Platform.OS == 'ios' ? 55 + heightToDp(3.8) : 55,
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: Platform.OS == 'ios' ? heightToDp(3.8) : 0,
    zIndex: 10,
  },
  heading: {
    color: '#fff',
    marginLeft: '5%',
    fontSize: widthToDp(4.9),
  },
});

export default Header;
