import React, {FunctionComponent, ReactChild} from 'react';
import {useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {heightToDp, widthToDp} from '../../values/size';
import AnalyticsFilterModal from '../Modals/AnalyticsFilterModal';

type props = {
  onBack: () => void;
  title: string;
  children?: ReactChild | boolean;
};

const AnalyticsHeader: FunctionComponent<props> = ({onBack, title}) => {
  const [showAnalyticsFilter, setShowAnalyticsFilter] = useState(false);
  return (
    <>
      <AnalyticsFilterModal
        show={showAnalyticsFilter}
        onBack={() => setShowAnalyticsFilter(false)}
      />
      <View style={styles.parent}>
        <TouchableOpacity onPress={onBack}>
          <Icon
            name={'arrow-back-outline'}
            color={'#000'}
            size={widthToDp(7.5)}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>{title}</Text>
        <View />

        <TouchableOpacity
          onPress={() => {
            setShowAnalyticsFilter(true);
          }}>
          <Icon name={'funnel-outline'} color={'#000'} size={20} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#fff',
    height: Platform.OS == 'ios' ? 55 + heightToDp(3.8) : 55,
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: Platform.OS == 'ios' ? heightToDp(3.8) : 0,
    zIndex: 10,
  },
  heading: {
    color: '#000',
    fontSize: widthToDp(4.9),
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 100,
    textAlign: 'center',
  },
});

export default AnalyticsHeader;
