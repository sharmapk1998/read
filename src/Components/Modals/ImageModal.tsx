import React, {FunctionComponent, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import ImageZoom from 'react-native-image-pan-zoom';
import {heightToDp, widthToDp} from '../../values/size';
import Modal from 'react-native-modal';
import {shareFile} from '../../Services/attachments';

type props = {
  show: boolean;
  url: string;
  hide: () => void;
  share?: boolean;
};
const ImageModal: FunctionComponent<props> = ({show, url, hide, share}) => {
  const [load, setLoad] = useState(false);
  return (
    <Modal
      useNativeDriver={true}
      isVisible={show}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      style={{margin: 0, width: '100%'}}>
      <ImageZoom
        cropWidth={load ? 0 : Dimensions.get('window').width}
        cropHeight={load ? 0 : Dimensions.get('window').height}
        imageWidth={load ? 0 : Dimensions.get('window').width}
        imageHeight={load ? 0 : Dimensions.get('window').height}>
        <Image
          source={{uri: url}}
          style={
            load
              ? {height: '0%', width: '0%'}
              : {
                  height: heightToDp(50),
                  width: widthToDp(90),
                  alignSelf: 'center',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }
          }
          resizeMode={'contain'}
          onLoadStart={() => setLoad(true)}
          onLoadEnd={() => setLoad(false)}
        />
      </ImageZoom>
      <TouchableOpacity
        style={{position: 'absolute', top: 30, right: 20}}
        onPress={hide}>
        <Icon name={'close'} size={40} color={'#fff'} />
      </TouchableOpacity>
      {share === true && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
            bottom: 0,
            marginBottom: '40%',
          }}>
          <TouchableOpacity
            onPress={() => shareFile(url, (value: boolean) => setLoad(value))}
            style={{
              backgroundColor: theme.colors.PRIMARY,
              paddingHorizontal: 7,
              paddingVertical: 7,
              borderRadius: 40,
            }}>
            <Icon name={'share-social'} size={35} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
      {load && <ActivityIndicator size="large" color={theme.colors.PRIMARY} />}
    </Modal>
  );
};

export default ImageModal;
