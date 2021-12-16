import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Header from '../Components/Header';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../values/theme';
import {formatAMPM, getCallLogTime} from '../Services/format';
import {heightToDp} from '../values/size';

type props = {
  navigation: any;
  callLogs: any[];
};

const CallLogView = ({item, index}: {item: any; index: number}) => {
  return (
    <View style={styles.callLogView}>
      <Icons name={'phone-outgoing'} color={'#000'} size={20} />

      <Text style={[styles.logText, {fontWeight: 'bold'}]}>
        {getCallLogTime(item.created_at.toDate())}
      </Text>
      <Text style={styles.logText}>{formatAMPM(item.created_at.toDate())}</Text>
      <Text style={[styles.logText, {color: theme.colors.HEADINGS}]}>
        {item.callTime}
      </Text>
    </View>
  );
};

const CallLogScreen: FunctionComponent<props> = ({navigation, callLogs}) => {
  return (
    <>
      <Header title={'Call Logs'} onBack={() => navigation.goBack()} />
      {callLogs && callLogs.length !== 0 ? (
        <FlatList
          style={styles.parent}
          keyExtractor={(item, index) => index.toString()}
          data={callLogs}
          renderItem={CallLogView}
          contentContainerStyle={{paddingBottom: heightToDp(2)}}
        />
      ) : (
        <View style={styles.noDataParent}>
          <Icons name={'phone'} size={90} color={theme.nav_colors.PRIMARY} />
          <Text style={styles.noDataText}>No Call Logs Available</Text>
        </View>
      )}
      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>
          Total:{' '}
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            {callLogs.length}
          </Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  callLogView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderRadius: 10,
  },
  logText: {
    fontSize: 15,
  },
  bottomBar: {
    marginTop: 'auto',
    height: 35,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#4B4849',
  },
  totalText: {
    marginLeft: 'auto',
    marginRight: '10%',
    color: '#fff',
    fontSize: 16,
  },
  noDataParent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.GREY,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: any) => {
  return {
    callLogs: state.calls.callLogs,
  };
};

export default connect(mapStateToProps)(CallLogScreen);
