import React, {FunctionComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import theme from '../../values/theme';
import Modal from 'react-native-modal';

type props = {
  show: boolean;
  hide: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
};
const RenameModal: FunctionComponent<props> = ({
  value,
  onChange,
  onSubmit,
  hide,
  show,
}) => {
  return (
    <Modal
      useNativeDriver={true}
      isVisible={show}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      style={styles.parent}>
      <View style={styles.dialogue}>
        <Text style={{fontSize: 14, color: theme.colors.GREY}}>File Name</Text>
        <TextInput value={value} onChangeText={onChange} style={styles.input} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onSubmit();
            hide();
          }}>
          <Text style={styles.upload}>UPLOAD</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    margin: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogue: {
    width: '85%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: '5%',
    paddingTop: 20,
  },
  input: {
    marginTop: 5,
    fontSize: 15,
    paddingVertical: 4,
    width: '92%',
    alignSelf: 'center',
    borderBottomColor: theme.colors.HEADINGS,
    borderBottomWidth: 0.5,
  },
  button: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
    marginBottom: 25,
    marginRight: 10,
  },
  upload: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.logo_colors.ADD,
  },
});

export default RenameModal;
