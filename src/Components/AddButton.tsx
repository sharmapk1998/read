import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../values/theme';
import IconFeather from 'react-native-vector-icons/Feather';
import {readContacts} from '../Services/communication';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

type props = {
  navigation: any;
  user: any;
};

const AddButton: FunctionComponent<props> = ({navigation, user}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {!show && (
        <TouchableOpacity
          style={[
            styles.addButtonContainer,
            {position: 'absolute', bottom: '10%', right: 20},
          ]}
          onPress={() => setShow(true)}>
          <Icon name={'add'} size={30} color={'#fff'} />
        </TouchableOpacity>
      )}
      <Modal
        useNativeDriver={true}
        isVisible={show}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={200}
        onBackButtonPress={() => setShow(false)}
        onBackdropPress={() => setShow(false)}
        style={{margin: 0, width: '100%'}}>
        {show === true && (
          <View style={styles.iconParent}>
            <View style={styles.iconTextView}>
              <Text style={styles.iconText}>New Contact</Text>
              <TouchableOpacity
                style={styles.iconConatiner}
                onPress={() => {
                  setShow(false);
                  navigation.navigate('AddContact');
                }}>
                <Icon
                  name={'person-circle'}
                  color={theme.logo_colors.ADD}
                  size={26}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.iconTextView}>
              <Text style={styles.iconText}>Import From Address Book</Text>
              <TouchableOpacity
                style={styles.iconConatiner}
                onPress={() =>
                  readContacts(user, navigation, () => setShow(false))
                }>
                <IconFeather
                  name={'download'}
                  color={theme.logo_colors.ADD}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => setShow(false)}>
              <Icon name={'close'} size={26} color={'#fff'} />
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: 52,
    borderRadius: 30,
    backgroundColor: theme.logo_colors.ADD,
  },
  iconParent: {
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: '10%',
    right: 20,
  },
  iconTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 5,
  },
  iconText: {
    color: '#fff',
    marginRight: 10,
    fontSize: 14,
  },
  iconConatiner: {
    height: 42,
    width: 42,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AddButton);
