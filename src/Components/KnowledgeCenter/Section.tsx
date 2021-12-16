import React, {FunctionComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import theme from '../../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';

type props = {
  text: string;
  source: any;
  title: string;
  onClick: any;
  style?: ViewStyle;
};
const Section: FunctionComponent<props> = ({
  text,
  source,
  title,
  onClick,
  style,
}) => {
  return (
    <View style={style}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.parent} onPress={onClick}>
        <Image
          source={source}
          resizeMode={'contain'}
          style={styles.imageStyle}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.info}>{text}</Text>
        </View>
        <View style={styles.iconView}>
          <View style={styles.icon}>
            <Icon name={'chevron-forward'} size={20} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: theme.colors.PRIMARY,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  parent: {
    marginTop: 12,
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    height: '80%',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '5%',
    paddingLeft: '3%',
  },
  contentContainer: {
    display: 'flex',
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: '70%',
    width: '43%',
  },
  info: {
    fontSize: 15.5,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  iconView: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
  },
  icon: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: 45,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Section;
