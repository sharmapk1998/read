import React, {FunctionComponent} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import Modal from 'react-native-modal';

type props = {
  onCamera: () => void;
  onGallery: () => void;
  onBack: () => void;
  show: boolean;
};
const SourceSelectModal: FunctionComponent<props> = ({
  onCamera,
  onGallery,
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
        <TouchableOpacity style={styles.option} onPress={onCamera}>
          <Icon name={'camera'} size={25} color={theme.colors.HEADINGS} />
          <Text style={{marginLeft: 10, fontSize: 18}}>Camera</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.option} onPress={onGallery}>
          <Icon name={'image'} size={25} color={theme.colors.HEADINGS} />
          <Text style={{marginLeft: 10, fontSize: 18}}>Gallery</Text>
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
    paddingVertical: '5%',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
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

export default SourceSelectModal;
