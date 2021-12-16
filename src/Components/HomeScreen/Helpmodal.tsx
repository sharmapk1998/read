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
import IconIon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import Modal from 'react-native-modal';
import {onCamera, onGallery} from '../../Services/attachments';
import {uploadUserImage} from '../../Services/user';
import {useDispatch} from 'react-redux';
import {signOut} from '../../Services/auth';
import Query from '../../screens/Query';

type props = {
  onBack: () => void;
  show: boolean;
  user: any;
  navigation: any;
};
const Helpmodal: FunctionComponent<props> = ({
  onBack,
  show,
  user,
  navigation,
}) => {
  const dipatcher = useDispatch();
  return (
    <Modal
      isVisible={show}
      useNativeDriver={true}
      onBackButtonPress={onBack}
      onBackdropPress={onBack}
      style={styles.parent}>
      <View style={styles.container}>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Query")}>
            <IconIon
            name={'document'}
            size={25}
            color={theme.nav_colors.PRIMARY}
          />
            <Text style={{marginLeft: 10, fontSize: 18}}>Help</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
                signOut(user, navigation, dipatcher);
              }}>
            <Icon name={'log-out-outline'} color={theme.colors.USER} size={26} />
            <Text style={{marginLeft: 10, fontSize: 18}}>
              Log Out
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
    marginTop: 10,
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

export default Helpmodal;
