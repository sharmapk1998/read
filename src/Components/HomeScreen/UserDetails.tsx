import React, {FunctionComponent, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import theme from '../../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {signOut} from '../../Services/auth';
import UserImageModal from './UserImageModal';
import Helpmodal from './Helpmodal';


type props = {
  user: any;
  navigation: any;
};

const UserDetails: FunctionComponent<props> = ({user, navigation}) => {
  const [showUserImageModal, setShowUserImageModal] = useState(false);
  const [Help, setHelp] = useState(false);
  const dispatcher = useDispatch();
  return (
    <>
      {showUserImageModal && (
        <UserImageModal
          show={showUserImageModal}
          onBack={() => setShowUserImageModal(false)}
          username={user.user_first_name + ' ' + user.user_last_name}
          userImage={user.user_image}
          uid={user.uid}
        />
      )}
      {Help && (
        <Helpmodal
          show={Help}
          onBack={() => setHelp(false)} user={user} navigation={navigation} />
      )}
      <View style={styles.parent}>
        <TouchableOpacity
          style={
            Platform.OS === 'ios'
              ? {position: 'absolute', top: 35, left: 12}
              : {position: 'absolute', top: 20, left: 12}
          }
          onPress={() => navigation.navigate('Notifications')}>
          <Icon name={'notifications'} color={'#FFFFFF'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            Platform.OS === 'ios'
              ? {position: 'absolute', top: 35, right: 20}
              : {position: 'absolute', top: 20, right: 20}
          }
          onPress={() => {
            signOut(user, navigation, dispatcher);
            // setHelp(true)
          }}>
          <Icon name={'log-out-outline'} color={'#FFF'} size={24} />
        </TouchableOpacity>
        {user.user_first_name !== undefined ? (
          <View style={styles.userDetails}>
            <TouchableOpacity onPress={() => setShowUserImageModal(true)}>
              {user.user_image && user.user_image.length !== 0 ? (
                <Image
                  source={{uri: user.user_image}}
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
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.user_first_name + ' ' + user.user_last_name}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {user.user_email}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.load}>
            <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: 155,
    width: '100%',
    backgroundColor: theme.colors.USER,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: '10%',
    alignItems: 'center',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  imageStyle: {
    height: 85,
    width: 85,
  },
  textContainer: {
    marginLeft: 20,
    width: '65%',
  },
  userName: {
    color: '#fff',
    fontSize: 19,
    width: '100%',
  },
  email: {
    fontSize: 15,
    marginTop: 5,
    color: '#fff',
    width: '100%',
  },
  load: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(UserDetails);
