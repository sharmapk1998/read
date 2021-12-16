import React, {useState} from 'react';
import {FunctionComponent} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AnalyticsMainPage from '../screens/analytics/AnalyticsMainPage';
import theme from '../values/theme';
import AnalyticsHeader from '../Components/Analytics/AnalyticsHeader';
import {View, StyleSheet} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {fetchAnalytics, fetchAnalyticsUser} from '../Services/analytics';
import Loader from '../Components/Modals/Loader';
import FeedbackScreen from '../screens/analytics/FeedbackScreen';
import TrendsScreen from '../screens/analytics/TrendsScreen';
import InterestedProjectTrend from '../screens/analytics/InterestedProjectTrend';
import InterestedBudget from '../screens/analytics/InterestedBudget';
import InterestedLocation from '../screens/analytics/InterestedLocation';
import CompletedTasksTrend from '../screens/analytics/CompletedTasksTrend';
import OverdueTasksTrend from '../screens/analytics/OverdueTasksTrend';
import ScheduledTasksTrend from '../screens/analytics/ScheduledTasksTrend';
import CallingAnalytics from '../screens/analytics/CallingAnalytics';

type props = {
  navigation: any;
  user: any;
  analytics: any;
  analyticsFilter: any;
};
const Tab = createMaterialTopTabNavigator();

const customLabel = (props: {color: string; focused: boolean}) => {
  return (
    <View style={props.focused ? styles.selectedDot : styles.notSelectedDot} />
  );
};

const AnalyticsScreens: FunctionComponent<props> = ({
  navigation,
  user,
  analytics,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (user.uid) {
      setLoad(true);
      fetchAnalyticsUser(user, dispatcher, analyticsFilter.analyticsType)
        .then(() => {
          setLoad(false);
        })
        .catch((error) => {setLoad(false);console.log(error)});
    }
  }, [user.uid, analyticsFilter.analyticsType]);
  return (
    <>
      <AnalyticsHeader title={'Analytics'} onBack={() => navigation.goBack()} />
      <Tab.Navigator
        lazy={true}
        tabBarPosition={'bottom'}
        tabBarOptions={{
          indicatorStyle: {height: 0},
          style: {
            alignSelf: 'center',
            height: 35,
            paddingHorizontal: 50,
            backgroundColor: '#fff',
            width: '100%',
            elevation: 0,
          },
          contentContainerStyle: {
            alignItems: 'center',
          },
        }}
        backBehavior={'none'}>
        <Tab.Screen
          name={'Analytics Main Page'}
          component={AnalyticsMainPage}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Feedback Screen'}
          component={FeedbackScreen}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Trends Screen'}
          component={TrendsScreen}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />

        <Tab.Screen
          name={'Calling Screen'}
          component={CallingAnalytics}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Interested Budget'}
          component={InterestedBudget}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Interested Project Trend'}
          component={InterestedProjectTrend}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Interested Locations'}
          component={InterestedLocation}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Completed Tasks Trend'}
          component={CompletedTasksTrend}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Overdue Tasks Trend'}
          component={OverdueTasksTrend}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        {analyticsFilter.analyticsType !== 'PM' && (
          <Tab.Screen
            name={'Scheduled Tasks Trend'}
            component={ScheduledTasksTrend}
            options={{
              tabBarLabel: (data) => customLabel(data),
            }}
          />
        )}
      </Tab.Navigator>
      {load && <Loader show={true} />}
    </>
  );
};

const styles = StyleSheet.create({
  selectedDot: {
    backgroundColor: '#000',
    height: 11,
    width: 11,
    borderRadius: 10,
  },
  notSelectedDot: {
    backgroundColor: theme.colors.GREY,
    height: 9.5,
    width: 9.5,
    borderRadius: 10,
    opacity: 0.4,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analytics: state.analytics,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(AnalyticsScreens);
