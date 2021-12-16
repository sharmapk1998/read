import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatAMPM, getFullDate} from '../Services/format';
import theme from '../values/theme';

type props = {
  date: Date;
  setDate: (date: Date) => void;
  style?: ViewStyle;
  title: string;
  dateTimeStyle?: ViewStyle;
  titleStyle?: TextStyle;
  dateFormat?: (date: Date) => string;
  noMinDate?: boolean;
};

const DateTime: FunctionComponent<props> = ({
  date,
  setDate,
  style,
  title,
  dateTimeStyle,
  titleStyle,
  dateFormat,
  noMinDate,
}) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChangeDate = (event: any, selectedDate: any) => {
    setShowDate(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setTimeout(() => setShowTime(true), 100);
  };

  const onChangeTime = (event: any, selectedTime: any) => {
    setShowTime(false);
    const currentTime = selectedTime || date;
    setDate(currentTime);
  };

  return (
    <View style={style}>
      <Text style={[{fontWeight: 'bold'}, titleStyle]}>
        {title}
        <Text style={{color: theme.colors.RED}}> *</Text>
      </Text>
      <TouchableOpacity
        style={[styles.dateTime, dateTimeStyle]}
        onPress={() => setShowDate(Platform.OS === 'android')}>
        <Icon
          name={'calendar-outline'}
          color={theme.colors.PRIMARY}
          size={22}
        />
        {showTime && (
          <DateTimePicker
            value={date}
            mode={'time'}
            display="default"
            onChange={onChangeTime}
            minimumDate={noMinDate ? undefined : new Date()}
          />
        )}
        {showDate && (
          <DateTimePicker
            value={date}
            mode={'date'}
            display="default"
            onChange={onChangeDate}
            minimumDate={noMinDate ? undefined : new Date()}
          />
        )}
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
export default DateTime;
