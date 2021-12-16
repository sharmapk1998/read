import React, {FunctionComponent, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import Modal from 'react-native-modal';
import {onCamera, onGallery} from '../../Services/attachments';
import {uploadUserImage} from '../../Services/user';
import {useDispatch} from 'react-redux';

type props = {
  onBack: () => void;
  show: boolean;
  username: string;
  userImage: string | undefined;
  uid: string;
};
const UserImageModal: FunctionComponent<props> = ({
  onBack,
  show,
  username,
  userImage,
  uid,
}) => {
  const [load, setLoad] = useState(false);
  const dipatcher = useDispatch();
  const uploadImage = async (data: any) => {
    const deletePrev = userImage && userImage.length !== 0 ? true : false;
    if (data.uri) {
      setLoad(true);
      await uploadUserImage(data.uri, uid, deletePrev, dipatcher);
      setTimeout(() => setLoad(false), 1000);
    }
  };
  return (
    <Modal
      isVisible={show}
      useNativeDriver={true}
      onBackButtonPress={onBack}
      onBackdropPress={onBack}
      style={styles.parent}>
      <View style={styles.container}>
        {load === false && (
          <>
            {userImage && userImage.length !== 0 ? (
              <Image
                source={{uri: userImage}}
                style={[styles.imageStyle, {borderRadius: 80}]}
                resizeMode={'cover'}
              />
            ) : (
              <Image
                source={require('../../../assets/user.png')}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
            )}
          </>
        )}
        {load === true && (
          <View
            style={{
              height: 100,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
          </View>
        )}
        <Text style={styles.userName}>{username}</Text>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => onCamera('photo', uploadImage, 'front')}>
            <Icon name={'camera'} size={25} color={theme.colors.HEADINGS} />
            <Text style={{marginLeft: 10, fontSize: 18}}>Take Photo</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.option}
            onPress={() => onGallery('photo', uploadImage)}>
            <Icon name={'image'} size={25} color={theme.colors.HEADINGS} />
            <Text style={{marginLeft: 10, fontSize: 18}}>
              Choose From Gallery
            </Text>
          </TouchableOpacity>
        </View>
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
  container: {
    width: '85%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  menu: {
    marginTop: 30,
    width: '95%',
    height: 85,
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
  imageStyle: {
    height: 100,
    width: 100,
  },
  userName: {
    marginTop: 5,
    fontSize: 17,
  },
});

export default UserImageModal;
