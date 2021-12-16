import React, {FunctionComponent} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import Modal from 'react-native-modal';

type props = {
  onAlt: () => void;
  onPrimary: () => void;

  onBack: () => void;
  show: boolean;
};
const NumberSelectModal: FunctionComponent<props> = ({
  onAlt,
  onPrimary,
  onBack,
  show,
}) => {
  return (
    <Modal
      useNativeDriver={true}
      isVisible={show}
      onBackButtonPress={onBack}
      onBackdropPress={onBack}
      style={styles.parent}>
      <View style={styles.dialogue}>
        <TouchableOpacity style={styles.option} onPress={onPrimary}>
          <Text style={{marginLeft: 10, fontSize: 18}}>Primary Number</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.option} onPress={onAlt}>
          <Text style={{marginLeft: 10, fontSize: 18}}>Alternate Number</Text>
        </TouchableOpacity>
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
    height: 120,
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
  },
  line: {
    height: 1.5,
    width: '100%',
    backgroundColor: theme.colors.GREY_LIGHT,
    opacity: 0.5,
  },
});

export default NumberSelectModal;
