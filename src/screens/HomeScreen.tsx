import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {resetAllLeadCount} from '../Services/leads';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import TaskCalender from '../Components/HomeScreen/TaskCalender';
import {
  resetGroupedLeads,
  resetTasks,
  setNotificationData,
  setSort,
  updateLeads,
  updateLeadType,
} from '../redux/actions';
import SplashScreen from 'react-native-splash-screen';
import {fetchCompanyResources, fetchConstants} from '../Services/values';
import {register} from 'react-native-bundle-splitter';
import {handleUser} from '../Services/auth';
import LeadHomeSection from '../Components/HomeScreen/LeadButtonsSection';
import {createTeamMap} from '../Services/user';
import {fetchStageCount} from '../Services/contactsAPI';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import {setGlobalRefresh } from '../redux/actions';

const UserDetails = register({
  loader: () => import('../Components/HomeScreen/UserDetails'),
});
const CustomCarousel = register({
  loader: () => import('../Components/HomeScreen/CustomCarousel'),
});

type props = {
  navigation: any;
  user: any;
  notificationData: any | undefined;
  remoteNotification: boolean;
};

const HomeScreen: FunctionComponent<props> = ({
  navigation,
  user,
  notificationData,
  remoteNotification,
}) => {
  const dispatcher = useDispatch();
  const [carouselList, setCarouselList] = useState<string[]>([]);
  const [first, setFirst] = useState(true);
  const [online, setOnline] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing]);
  useEffect(() => {
    if (notificationData) {
      navigation.navigate('LeadDeatils', {
        leadData: JSON.parse(JSON.stringify(notificationData)),
      });
      dispatcher(setNotificationData(undefined));
    }
  }, [notificationData]);

  useEffect(() => {
    if (user.organization_id && user.usersList && remoteNotification) {
      dispatcher(setSort({FRESH: false}));
      dispatcher(updateLeadType('FRESH'));
      navigation.navigate('Leads', {
        title: 'Fresh Leads',
      });
    }
  }, [user.organization_id, user.usersList, remoteNotification]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setOnline(false);
        
        Snackbar.show({
          text: 'Poor Connection!',
          duration: Snackbar.LENGTH_INDEFINITE,
          action:{
            text:"Show Error",
            textColor:'green',
            onPress:()=>{
              setTimeout(
                () =>
              Snackbar.show({
                text: 'no internet',
                duration: Snackbar.LENGTH_LONG,
              }),
              2000,
              );
            },
          },
        });
      } else {
        setOnline(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (first) {
      setFirst(false);
    } else if (online) {
      Snackbar.dismiss();
    }
  }, [online]);

  useEffect(() => {
    SplashScreen.hide();
    if (user.uid) {
      const unSub = handleUser(user, navigation, dispatcher);
      return unSub;
    }
    setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
  }, [user.uid]);

  useEffect(() => {
    if (user.uid) {
      console.log('FETCH COUNT');
      fetchStageCount(user.uid, dispatcher);
    }
  }, [user.uid, refresh]);

  useEffect(() => {
    const onFocusUnsubscribe = navigation.addListener('focus', () => {
      dispatcher(updateLeads(undefined));
      dispatcher(resetGroupedLeads());
    });
    if (user.usersList && user.usersList.length !== 0 && user.organization_id) {
      const unSubFetchConst = fetchConstants(dispatcher);
      let unSubFetchCompRes = fetchCompanyResources(
        user.organization_id,
        (data) => setCarouselList(data),
        dispatcher,
      );
      return () => {
        unSubFetchCompRes();
        onFocusUnsubscribe();
        unSubFetchConst();
      };
    }
  }, [user.usersList]);

  useEffect(() => {
    if (user.organization_users) {
      createTeamMap(user.organization_users, dispatcher);
    }
  }, [user.organization_users]);

  useEffect(() => {
    return () => {
      dispatcher(resetTasks());
      resetAllLeadCount(dispatcher);
    };
  }, []);

  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: '5%'}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefresh(!refresh);
            setRefreshing(true);
          }}
        />
      }
      keyboardShouldPersistTaps={'handled'}>
      <UserDetails navigation={navigation} />
      <View style={styles.content}>
        <CustomCarousel carouselList={carouselList} />
        <TaskCalender
          style={{marginTop: 20}}
          navigation={navigation}
          refresh={refresh}
        />
        <LeadHomeSection navigation={navigation} style={{marginTop: 30}} />

        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => navigation.navigate('Analytics')}>
          <View style={{backgroundColor: '#fff'}}>
            <Icon name={'analytics'} color={theme.colors.USER} size={18} />
          </View>
          <Text style={styles.analyticsText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.GREY_BACKGROUND,
  },
  content: {
    paddingHorizontal: '5%',
    width: '100%',
    marginTop: -25,
  },
  analyticsButton: {
    backgroundColor: theme.colors.USER,
    width: '100%',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  analyticsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    notificationData: state.notification.notificationData,
    remoteNotification: state.notification.remoteNotification,
  };
};

export default connect(mapStateToProps)(HomeScreen);
