import React, {FunctionComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';

type props = {
  hide: () => void;
  note: string;
  date: string;
  color: string;
  show: boolean;
};
const NoteModal: FunctionComponent<props> = ({
  note,
  date,
  hide,
  color,
  show,
}) => {
  return (
    <Modal
      isVisible={show}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      style={styles.parent}
      useNativeDriver={true}>
      <View style={[styles.dialogue, {backgroundColor: color}]}>
        <Text style={{marginBottom: 20}}>
          <Icon name={'edit-3'} size={16} />
          <Text style={{fontSize: 15}}>{`   ${note}`}</Text>
        </Text>

        <Text style={styles.date}>{date}</Text>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: '5%',
    paddingTop: 15,
    paddingBottom: 10,
  },
  date: {
    marginTop: 'auto',
    textAlign: 'right',
    fontSize: 12,
  },
});

export default NoteModal;
