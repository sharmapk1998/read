import React, {FunctionComponent} from 'react';
import {Text, View} from 'react-native';
import {widthToDp} from '../../values/size';

type props = {
  itemKey: string;
  value: string;
};

const KeyValue: FunctionComponent<props> = ({itemKey, value}) => {
  return (
    <View style={{marginBottom: 9}}>
      <Text style={{fontSize: widthToDp(3)}}>{`${itemKey}:`}</Text>
      <Text style={{fontSize: widthToDp(4), fontWeight: 'bold', marginTop: 2}}>
        {value.length !== 0
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : '-'}
      </Text>
    </View>
  );
};

export default KeyValue;
