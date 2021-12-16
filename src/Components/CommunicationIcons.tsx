import React, {FunctionComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {widthToDp} from '../values/size';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../values/theme';
import {mailOpen, phoneCall, whatsappOpen} from '../Services/communication';
import {connect, useStore} from 'react-redux';
import {useState} from 'react';
import NumberSelectModal from './Modals/NumberSelectModal';

type props = {
  size: number;
  lead: any;
  user: any;
  leadId: string;
  style?: ViewStyle;
  disabled?: boolean;
};

const IconArray: FunctionComponent<props> = ({
  size,
  lead,
  leadId,
  user,
  style,
  disabled,
}) => {
  const [showPhoneSelect, setShowPhoneSelect] = useState(false);
  const [showCallSelect, setShowCallSelect] = useState(false);
  const onWhatapp = () => {
    if (lead.alternate_no === '') {
      whatsappOpen(lead.contact_no, lead.country_code);
    } else {
      setShowPhoneSelect(true);
    }
  };
  const onCall = () => {
    if (lead.alternate_no === '') {
      phoneCall(lead.contact_no, lead.country_code, leadId, user);
    } else {
      setShowCallSelect(true);
    }
  };
  return (
    <View style={[styles(size).iconParent, style]}>
      {showPhoneSelect && (
        <NumberSelectModal
          show={showPhoneSelect}
          onBack={() => setShowPhoneSelect(false)}
          onAlt={() => whatsappOpen(lead.alternate_no, lead.country_code)}
          onPrimary={() => whatsappOpen(lead.contact_no, lead.country_code)}
        />
      )}
      {showCallSelect && (
        <NumberSelectModal
          show={showCallSelect}
          onBack={() => setShowCallSelect(false)}
          onAlt={() =>
            phoneCall(lead.alternate_no, lead.country_code, leadId, user)
          }
          onPrimary={() =>
            phoneCall(lead.contact_no, lead.country_code, leadId, user)
          }
        />
      )}
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles(size).iconView,
          {backgroundColor: theme.logo_colors.PHONE},
        ]}
        onPress={onCall}>
        <Icon name={'call'} size={widthToDp(size * 0.625)} color={'#fff'} />
      </TouchableOpacity>

      <View style={styles(size).line} />
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles(size).iconView,
          {backgroundColor: theme.logo_colors.MAIL},
        ]}
        onPress={() => mailOpen(lead.email)}>
        <Icon name={'mail'} size={widthToDp(size * 0.625)} color={'#fff'} />
      </TouchableOpacity>
      <View style={styles(size).line} />

      <TouchableOpacity
        disabled={disabled}
        style={[
          styles(size).iconView,
          {backgroundColor: theme.logo_colors.WHATSAPP},
        ]}
        onPress={onWhatapp}>
        <Icon
          name={'logo-whatsapp'}
          size={widthToDp(size * 0.625)}
          color={'#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = (size: any) =>
  StyleSheet.create({
    iconParent: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconView: {
      height: widthToDp(parseFloat(size)),
      width: widthToDp(parseFloat(size)),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: widthToDp(parseFloat(size) / 2),
    },
    line: {
      height: '50%',
      width: 0.9,
      opacity: 0.4,
      backgroundColor: theme.colors.GREY_LIGHT,
    },
  });

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(IconArray);
