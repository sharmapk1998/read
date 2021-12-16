import React, {useEffect} from 'react';
import {useState} from 'react';
import {FunctionComponent} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import {heightToDp, widthToDp} from '../values/size';
import Icon from 'react-native-vector-icons/Ionicons';
import {getHeading} from '../Services/format';

type props = {
  navigation: any;
};

const Compass: FunctionComponent<props> = ({navigation}) => {
  const [compassHeading, setCompassHeading] = useState(0);
  useEffect(() => {
    const degree_update_rate = 1;
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  return (
    <View style={styles.parent}>
      <Image
        style={[
          styles.image,
          {transform: [{rotate: `${360 - compassHeading}deg`}]},
        ]}
        resizeMode="contain"
        source={require('../../assets/Compass.png')}
      />
      <View
        style={{
          position: 'absolute',
          height: heightToDp(100),
          width: widthToDp(100),
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#000',
            marginTop: 'auto',
            marginBottom: heightToDp(15),
            fontSize: 30,
          }}>{`${compassHeading}° ${getHeading(compassHeading)}`}</Text>
      </View>

      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          position: 'absolute',
          top: Platform.OS == 'ios' ? heightToDp(3.8) + 15 : 15,
          left: 10,
        }}>
        <Icon
          name={'arrow-back-outline'}
          color={'#000'}
          size={widthToDp(7.5)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    width: '90%',
    flex: 1,
    alignSelf: 'center',
  },
});

export default Compass;
