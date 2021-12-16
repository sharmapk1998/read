import React, {FunctionComponent} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

type props = {
  count: string;
  bgcolor: string;
  title: string;
  onPress: () => void;
  showBadge: boolean;
  textColor?: string;
};

const LeadButton: FunctionComponent<props> = ({
  count,
  title,
  bgcolor,
  onPress,
  showBadge,
  textColor = '#fff',
}) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.parent, {backgroundColor: bgcolor}]}
        onPress={onPress}>
        <Text style={[styles.count, {color: textColor}]}>{count}</Text>
        <Text style={[styles.title, {color: textColor}]}>{title}</Text>
      </TouchableOpacity>
      {showBadge === true && <View style={styles.badge} />}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: 97,
    width: 93,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  count: {
    color: '#ffffff',
    fontSize: 22,
  },
  title: {
    color: '#ffffff',
    marginTop: 5,
    fontSize: 15,
  },
  badge: {
    height: 12,
    width: 12,
    borderRadius: 10,
    backgroundColor: '#D83B2A',
    position: 'absolute',
    bottom: 1.5,
    right: 1,
    elevation: 12,
  },
});

export default LeadButton;
