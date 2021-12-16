import React, {FunctionComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import theme from '../values/theme';
import {useDispatch} from 'react-redux';

type props = {
  task: any;
  index: number;
  onPress: () => void;
};

const TaskView: FunctionComponent<props> = ({task, index, onPress}) => {
  const dispatcher = useDispatch();
  return (
    <View
      style={
        index == 0
          ? [styles.leadViewParent]
          : [styles.leadViewParent, styles.border]
      }>
      <>
        <TouchableOpacity style={styles.textParent} onPress={onPress}>
          <Text style={styles.head} numberOfLines={2}>
            {task.data.customer_name}
          </Text>
          <Text style={styles.subHead}>{task.data.type}</Text>
          <Text style={styles.stage}>{task.data.project}</Text>
        </TouchableOpacity>
        <View style={styles.iconViewFollwUp}>
          <Text style={styles.stage}>{task.data.budget}</Text>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  leadViewParent: {
    width: '100%',
    minHeight: 75,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  border: {
    borderTopWidth: 0.7,
    borderColor: theme.colors.GREY_LIGHT,
  },
  textParent: {
    marginStart: '3%',
    width: '56%',
    paddingVertical: 10,
  },
  head: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHead: {
    color: theme.colors.GREY,
    marginTop: 5,
    fontSize: 14,
  },
  stage: {
    fontSize: 12,
    color: theme.colors.GREY,
    marginTop: 5,
  },
  iconViewFollwUp: {
    width: '35%',
    marginLeft: 'auto',
    marginRight: '2.5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: '4%',
    paddingBottom: 10,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default TaskView;
