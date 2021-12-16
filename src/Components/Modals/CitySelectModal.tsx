import React, {FunctionComponent} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../../values/theme';
import Modal from 'react-native-modal';

type props = {
  setCity: (city: string) => void;
  onBack: () => void;
  show: boolean;
  cityList: string[];
};
const CitySelectModal: FunctionComponent<props> = ({
  setCity,
  onBack,
  show,
  cityList,
}) => {
  return (
    <Modal
      useNativeDriver={true}
      isVisible={show}
      onBackButtonPress={onBack}
      onBackdropPress={onBack}
      style={styles.parent}>
      <View style={styles.dialogue}>
        {cityList.map((city, index) => (
          <View key={index} style={{width: '100%'}}>
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => setCity(city)}>
              <Text style={{marginLeft: 10, fontSize: 18}}>{city}</Text>
            </TouchableOpacity>
            {index !== cityList.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogue: {
    width: '85%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: '3%',
    justifyContent: 'space-evenly',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '3%',
    height: 45,
  },
  line: {
    height: 1.5,
    width: '100%',
    backgroundColor: theme.colors.GREY_LIGHT,
    opacity: 0.5,
  },
});

export default CitySelectModal;
