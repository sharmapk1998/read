import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from '../Components/HeaderSearch';
import theme from '../values/theme';
import {connect, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/core';
import {
  setActiveFilters,
  setSearchStringGlobal,
  setSelectedLeads,
  toggleSelectLeads,
} from '../redux/actions';
import {properFormat} from '../Services/format';
import LeadsListScreen from '../screens/LeadsListScreen';
import {getBasicFilters, getFilterValues} from '../Services/contactsAPI';

const Tab = createMaterialTopTabNavigator();
const customLabel = (
  label: string,
  props: {color: string; focused: boolean},
  count: number,
) => {
  return (
    <View style={styles.labelParent}>
      <Text style={{color: props.color, fontSize: 15}}>{label}</Text>
      {/* <Text style={[styles.count, {backgroundColor: props.color}]}>
        {count}
      </Text> */}
    </View>
  );
};

type props = {
  navigation: any;
  user: any;
  leadData: any;
  callBackReasons: string[];
  followUpReasons: string[];
  route: any;
  filters: any;
};
const CallBackTopBar: FunctionComponent<props> = ({
  navigation,
  user,
  leadData,
  callBackReasons,
  followUpReasons,
  route,
}) => {
  const title = route.params.title;
  const [searchQuery, setSearchQuery] = useState('');
  const reasons =
    leadData.leadType === 'CALLBACK'
      ? callBackReasons
      : leadData.leadType === 'PROSPECT' || leadData.leadType === 'MISSED'
      ? ['INTERESTED', 'CALLBACK']
      : followUpReasons;
  const dispatcher = useDispatch();

  useEffect(() => {
    dispatcher(setSearchStringGlobal(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      dispatcher(setActiveFilters({}));
      dispatcher(toggleSelectLeads(false));
      dispatcher(setSelectedLeads([]));
      dispatcher(setSearchStringGlobal(''));
    };
  }, []);

  useEffect(() => {
    if (user.uid) {
      getFilterValues(user.uid, leadData.leadType, dispatcher);
    }
  }, [leadData.leadType, user.uid]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <>
      <Header
        title={title}
        onBack={() => navigation.goBack()}
        serachQuery={searchQuery}
        updateSearchQuery={(value: string) => setSearchQuery(value)}
        menu
        showSort
      />
      {leadData.leadType && (
        <Tab.Navigator
          tabBarOptions={{
            style: {backgroundColor: theme.nav_colors.PRIMARY},
            activeTintColor: '#fff',
            indicatorStyle: {backgroundColor: '#fff', height: 3},
            scrollEnabled:
              leadData.leadType === 'PROSPECT' || leadData.leadType === 'MISSED'
                ? false
                : true,
          }}>
          {reasons.map((reason, index) => (
            <Tab.Screen
              key={index}
              name={reason === 'CALLBACK' ? 'Call Back' : properFormat(reason)}
              component={LeadsListScreen}
              initialParams={{
                basicFilters: getBasicFilters(leadData.leadType, reason),
              }}
              options={{
                tabBarLabel: (data) =>
                  customLabel(
                    reason === 'CALLBACK' ? 'Call Back' : properFormat(reason),
                    data,
                    leadData.groupedLeads[reason]
                      ? leadData.groupedLeads[reason].length
                      : 0,
                  ),
              }}
            />
          ))}
        </Tab.Navigator>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  labelParent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    color: theme.nav_colors.PRIMARY,
    marginLeft: 7,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 14,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    leadData: state.leads,
    callBackReasons: state.values?.constants.call_back,
    followUpReasons: state.values?.constants.follow_up_type,
  };
};
export default connect(mapStateToProps)(CallBackTopBar);
