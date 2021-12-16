import React, {FunctionComponent, useState} from 'react';
import {Modal, View, Dimensions, ActivityIndicator} from 'react-native';
//@ts-ignore
import VideoPlayer from 'react-native-video-controls';
import theme from '../../values/theme';
const {height, width} = Dimensions.get('window');
type props = {
  show: boolean;
  url: string;
  hide: () => void;
};
const VideoModal: FunctionComponent<props> = ({show, url, hide}) => {
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
        <VideoPlayer
          source={{uri: url}}
          style={{width: '100%'}}
          seekColor={theme.colors.HEADINGS}
          navigator={() => hide()}
          onBack={() => hide()}
        />
      </View>
    </Modal>
  );
};

export default VideoModal;
