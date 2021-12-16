import React, {FunctionComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {formatAMPM, getCallLogTime} from '../../Services/format';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';

type props = {
  callLogs: any[];
};

const CallLogs: FunctionComponent<props> = ({callLogs}) => {
  return (
    <>
      {callLogs && callLogs[0] ? (
        <View style={styles.parent}>
          <View style={styles.logView}>
            <Icon name={'call'} color={'#000'} size={20} />
            <Text style={[styles.logText, {color: theme.colors.HEADINGS}]}>
              {callLogs[0].callTime}
            </Text>
            <Text style={styles.logText}>
              {getCallLogTime(callLogs[0].created_at.toDate())}
            </Text>
            <Text style={styles.logText}>
              {formatAMPM(callLogs[0].created_at.toDate())}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text>
              Total Calls:
              <Text style={{fontWeight: 'bold'}}>{` ${callLogs.length}`}</Text>
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.parent, styles.noCallLogView]}>
          <Text style={styles.noCallLogText}>No Call Logs</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    paddingHorizontal: '5%',
  },
  logView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  logText: {
    fontSize: 15,
  },
  totalContainer: {
    marginTop: 'auto',
    alignItems: 'flex-end',
  },
  noCallLogView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCallLogText: {
    fontSize: 17,
    color: theme.colors.GREY_LIGHT,
  },
});

const mapStateToProps = (state: any) => {
  return {
    callLogs: state.calls.callLogs,
  };
};

export default connect(mapStateToProps)(CallLogs);
