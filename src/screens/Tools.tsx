import React, {FunctionComponent} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import Header from '../Components/Header';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';

type props = {
  navigation: any;
};

const Tools: FunctionComponent<props> = ({navigation}) => {
  return (
    <>
      <Header title={'Tools'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Compass')}>
          <Text style={styles.title}>{'Compass'}</Text>
          <Image
            source={require('../../assets/Cmps_icon.png')}
            resizeMode={'contain'}
            style={styles.imageStyle}
          />

          <View style={styles.iconView}>
            <View style={styles.icon}>
              <Icon name={'chevron-forward'} size={20}/>
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Converter')}>
          <Text style={styles.title}>{'Converter'}</Text>
          <Image
            source={require('../../assets/Converter.png')}
            resizeMode={'contain'}
            style={styles.imageStyle}
          />
          <View style={styles.iconView}>
            <View style={styles.icon}>
              <Icon name={'chevron-forward'} size={20} />
            </View>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Calculater')}>
          <Text style={styles.title}>{'Calculator'}</Text>
          <Image
            source={require('../../assets/Calculator.png')}
            resizeMode={'contain'}
            style={styles.imageStyle}
          />

          <View style={styles.iconView}>
            <View style={styles.icon}>
              <Icon name={'chevron-forward'} size={20} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    marginHorizontal: '5%',
    paddingVertical: 15,
  },
  title: {
    fontSize: 22,
    color: theme.colors.PRIMARY,
    fontWeight: 'bold',
    width: '49%',
    textAlign: 'center',
  },
  section: {
    width: '100%',
    height: '23%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '5%',
    paddingLeft: '3%',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageStyle: {
    height: '68%',
    width: '43%',
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

export default Tools;
