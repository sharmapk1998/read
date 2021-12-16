import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {mapFollowUpToNotification} from '../Services/notification';
import {heightToDp} from '../values/size';
import {getNotificationTime} from '../Services/format';
import theme from '../values/theme';
import {fetchSingleLead} from '../Services/leads';
import Loader from '../Components/Modals/Loader';
import HeaderSearch from '../Components/HeaderSearch';

type props = {
  navigation: any;
  tasks: {[key: string]: any};
};

const NotificationView = ({
  item,
  navigation,
  setLoad,
}: {
  item: any;
  navigation: any;
  setLoad: (value: boolean) => void;
}) => {
  const onPress = async () => {
    setLoad(true);
    const data = await fetchSingleLead(item.leadId);
    const leadData = {
      id: item.leadId,
      data,
    };
    setLoad(false);
    navigation.navigate('LeadDeatils', {
      leadData,
    });
  };
  return (
    <View>
      <TouchableOpacity style={styles.notificationView} onPress={onPress}>
        <Text style={styles.head}>{item.type}</Text>
        <Text style={styles.message}>
          {mapFollowUpToNotification(item.type, item.customer_name).message}
        </Text>
        <Text style={styles.time}>{getNotificationTime(item.due_date)}</Text>
      </TouchableOpacity>
      <View style={styles.line} />
    </View>
  );
};

const NotificationScreen: FunctionComponent<props> = ({navigation, tasks}) => {
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const sortDate = (a: any, b: any) => {
    if (a.due_date.toDate() <= b.due_date.toDate()) {
      return 1;
    } else {
      return -1;
    }
  };
  useEffect(() => {
    let data: any[] = [];
    const tasksData = Object.values(tasks);
    tasksData.forEach((task: any, index: number) => {
      if (task?.status) {
        data = data.concat(task.tasks);
      }
    });
    data = data.filter((item: any) => item.due_date.toDate() <= new Date());
    setNotificationData(data.sort(sortDate));
  }, [tasks]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let newData = [...notificationData];
    newData = notificationData.filter((item: any) =>
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(newData);
  }, [searchQuery, notificationData]);
  return (
    <>
      {load === true && <Loader show={load} />}
      <HeaderSearch
        placeHolder={'Client Name'}
        title={'Notifications'}
        onBack={() => navigation.goBack()}
        serachQuery={searchQuery}
        updateSearchQuery={(value: string) => setSearchQuery(value)}
        hideFilter
      />
      <FlatList
        style={styles.parent}
        keyExtractor={(item, index) => String(index)}
        data={filteredData}
        renderItem={({item, index}: {item: any; index: number}) => (
          <NotificationView
            item={item}
            navigation={navigation}
            setLoad={(value: boolean) => setLoad(value)}
          />
        )}
        contentContainerStyle={{paddingBottom: heightToDp(2)}}
      />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    flex: 1,
  },
  notificationView: {
    marginTop: 5,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
  },
  head: {
    fontSize: 17,
    color: theme.colors.HEADINGS,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    marginTop: 5,
    color: theme.colors.GREY,
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    color: theme.colors.GREY,
  },
  line: {
    width: '95%',
    height: 0.5,
    backgroundColor: theme.colors.GREY_LIGHT,
    alignSelf: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    tasks: state.tasks,
  };
};

export default connect(mapStateToProps)(NotificationScreen);
