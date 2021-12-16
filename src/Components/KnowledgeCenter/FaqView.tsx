import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import theme from '../../values/theme';

type props = {
  item: any;
  onPress: () => void;
};

const FaqView: FunctionComponent<props> = ({item, onPress}) => {
  return (
    <View style={styles.parent}>
      <Text style={styles.question}>{item.question}</Text>
      <TouchableOpacity style={styles.answerButton} onPress={onPress}>
        <Text style={styles.buttonTitle}>Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    paddingHorizontal: '4%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  question: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  answerButton: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 12,
  },
});

export default FaqView;
