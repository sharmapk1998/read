import React, {FunctionComponent} from 'react';
import {Modal, View, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';
const {height, width} = Dimensions.get('window');
type props = {
  show: boolean;
  url: string;
  hide: () => void;
};
const PdfModal: FunctionComponent<props> = ({show, url, hide}) => {
  return (
    <Modal visible={show} transparent={true} onRequestClose={hide}>
      <View
        style={{
          height: height,
          width: width,
          backgroundColor: '#00000090',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pdf source={{uri: url}} style={{height: '100%', width: '100%'}} />
      </View>
    </Modal>
  );
};

export default PdfModal;
