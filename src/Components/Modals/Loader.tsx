import React, {FunctionComponent} from 'react';
import {ActivityIndicator, Modal, View, Dimensions} from 'react-native';
import theme from '../../values/theme';
const {height, width} = Dimensions.get('window');

type props = {
  show: boolean;
};
const Loader: FunctionComponent<props> = ({show}) => {
  return (
    <Modal visible={show} transparent={true}>
      <View
        style={{
          height: height,
          width: width,
          backgroundColor: '#00000030',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      </View>
    </Modal>
  );
};

export default Loader;
