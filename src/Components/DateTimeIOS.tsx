import React, {FunctionComponent, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatAMPM, getFullDate} from '../Services/format';
import theme from '../values/theme';
import Modal from 'react-native-modal';

type props = {
  date: Date;
  setDate: (date: Date) => void;
  style?: ViewStyle;
  title: string;
  dateTimeStyle?: ViewStyle;
  titleStyle?: TextStyle;
  dateFormat?: (date: Date) => string;
};

const DateTimeIOS: FunctionComponent<props> = ({
  date,
  setDate,
  style,
  title,
  dateTimeStyle,
  titleStyle,
  dateFormat,
}) => {
  const [showDateTime, setShowDateTime] = useState(false);
  const onChangeDateTime = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  return (
    <View style={style}>
      <Text style={[{fontWeight: 'bold'}, titleStyle]}>
        {title}
        <Text style={{color: theme.colors.RED}}> *</Text>
      </Text>
      <TouchableOpacity
        style={[styles.dateTime, dateTimeStyle]}
        onPress={() => setShowDateTime(true)}>
        <Icon
          name={'calendar-outline'}
          color={theme.colors.PRIMARY}
          size={22}
        />
        <Modal
          isVisible={showDateTime}
          onBackButtonPress={() => setShowDateTime(false)}
          onBackdropPress={() => setShowDateTime(false)}
          style={{margin: 0, width: '100%'}}>
          <View
            style={{
              height: 350,
              width: '80%',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 10,
              alignSelf: 'center',
            }}>
            <DateTimePicker
              style={{
                height: '100%',
                width: '100%',
              }}
              value={date}
              //@ts-ignore
              mode={'datetime'}
              display="inline"
              onChange={onChangeDateTime}
              themeVariant={'light'}
            />
          </View>
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: '5%',
          }}>
          <Text style={{flex: 1}}>
            {dateFormat ? dateFormat(date) : getFullDate(date)}
          </Text>
          <Text style={{flex: 1}}>{formatAMPM(date)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateTime: {
    height: 50,
    width: '100%',
    marginTop: 15,
    backgroundColor: theme.colors.GREY_BACKGROUND,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3%',
  },
});
export default DateTimeIOS;
