import React, {useState} from 'react';
import {FunctionComponent} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import theme from '../values/theme';
import AnalyticsHeader from '../Components/Analytics/AnalyticsHeader';
import {View, StyleSheet} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {fetchAnalytics} from '../Services/analytics';
import Loader from '../Components/Modals/Loader';
import TrendsScreen from '../screens/analytics/TrendsScreen';
import InterestedProjectTrend from '../screens/analytics/InterestedProjectTrend';
import InterestedBudget from '../screens/analytics/InterestedBudget';
import InterestedLocation from '../screens/analytics/InterestedLocation';
import OrgAnalyticsMainPage from '../screens/analytics/OrgAnalyticsMainPage';
import OrgFeedbackScreen from '../screens/analytics/OrgFeedbackScreen';
import IntPropertyType from '../screens/analytics/IntPropertyType';
import IntPropertyStage from '../screens/analytics/IntPropertyStage';
import LostReasons from '../screens/analytics/LostReasons';
import NotIntReasons from '../screens/analytics/NotIntReasons';
import OrgTasksAnalytics from '../screens/analytics/OrgTasksAnalytics';
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

const OrgAnalyticsScreens: FunctionComponent<props> = ({
  navigation,
  user,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (user.uid) {
      setLoad(true);
      fetchAnalytics(user, dispatcher, analyticsFilter.analyticsType)
        .then(() => {
          setLoad(false);
        })
        .catch((error) => {
          setLoad(false);
          console.log('Analytis Error - ', error);
        });
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
          component={OrgAnalyticsMainPage}
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
          name={'Feedback Screen'}
          component={OrgFeedbackScreen}
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
          name={'Interested Property Type'}
          component={IntPropertyType}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Interested Property Stage'}
          component={IntPropertyStage}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Completed Tasks Trend'}
          initialParams={{type: 'Completed'}}
          component={OrgTasksAnalytics}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Overdue Tasks Trend'}
          initialParams={{type: 'Overdue'}}
          component={OrgTasksAnalytics}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Scheduled Tasks Trend'}
          initialParams={{type: 'Pending'}}
          component={OrgTasksAnalytics}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Not Interested Reasons'}
          component={NotIntReasons}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
        <Tab.Screen
          name={'Lost Reasons'}
          component={LostReasons}
          options={{
            tabBarLabel: (data) => customLabel(data),
          }}
        />
      </Tab.Navigator>
      {load && <Loader show={true} />}
    </>
  );
};

const styles = StyleSheet.create({
  selectedDot: {
    backgroundColor: '#000',
    height: 10,
    width: 10,
    borderRadius: 10,
  },
  notSelectedDot: {
    backgroundColor: theme.colors.GREY,
    height: 9,
    width: 9,
    borderRadius: 10,
    opacity: 0.4,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(OrgAnalyticsScreens);
