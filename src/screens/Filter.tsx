import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../Components/Header';
import {
  FilterList as globalFilterList,
  TaskFilterList,
} from '../Services/filter';
import theme from '../values/theme';
import CheckBox from '@react-native-community/checkbox';
import {LEAD_TYPE} from '../values/customTypes';
import {setActiveFilters} from '../redux/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import {heightToDp} from '../values/size';
import DateTime from '../Components/DateTime';
import DateTimeIOS from '../Components/DateTimeIOS';
import {getFilterDate} from '../Services/format';
import moment from 'moment';

type props = {
  navigation: any;
  leadFilterObject: {[key: string]: string[]};
  leadType: LEAD_TYPE;
  activeFilters: {[key: string]: any[]};
  permission: any;
  user: any;
  type: LEAD_TYPE;
};
const Filter: FunctionComponent<props> = ({
  navigation,
  leadFilterObject,
  activeFilters,
  permission,
  user,
  type,
}) => {
  const [FilterList, setFilterList] = useState<{[key: string]: string}>({});
  const [from, setFrom] = useState(
    activeFilters?.['lead_assign_time']
      ? activeFilters?.['lead_assign_time'][0]
      : new Date(),
  );
  const [to, setTo] = useState(
    activeFilters?.['lead_assign_time']
      ? activeFilters?.['lead_assign_time'][1]
      : new Date(),
  );
  useEffect(() => {
    if (type === 'TASKS') {
      setFilterList(TaskFilterList);
      return;
    }
    if (user.role === 'Lead Manager') {
      setFilterList(globalFilterList);
    } else {
      let data: {[key: string]: string} = {};
      if (permission && permission[user.role]) {
        let userPermission: string[] = permission[user.role];
        Object.keys(globalFilterList).forEach((key) => {
          if (userPermission.includes(key)) {
            data[key] = globalFilterList[key];
          }
        });
        setFilterList(data);
      }
    }
  }, [permission]);
  const dispatcher = useDispatch();
  const [selectedLabel, setSelectedLabel] = useState({
    index: 0,
    value: Object.keys(FilterList)[0],
  });

  const [label, setLabel] = useState('');
  const [filterValues, setFilterValues] = useState<string[]>(
    leadFilterObject[label] ? leadFilterObject[label] : [],
  );
  useEffect(() => {
    const value = Object.keys(FilterList)[0];
    setLabel(FilterList[value]);
    setSelectedLabel({index: 0, value});
  }, [FilterList]);

  useEffect(() => {
    setLabel(FilterList[selectedLabel.value]);
  }, [selectedLabel, FilterList]);

  useEffect(() => {
    setFilterValues(leadFilterObject[label] ? leadFilterObject[label] : []);
  }, [leadFilterObject, label]);

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({...activeFilters});

  const onSelect = (value: string, status: boolean) => {
    const label = FilterList[selectedLabel.value];
    const data = {...selectedFilters};
    if (status === true) {
      if (data[label]) {
        data[label].push(value);
      } else {
        data[label] = [value];
      }
    } else {
      var index = data[label].indexOf(value);
      if (index > -1) {
        data[label].splice(index, 1);
      }
    }
    if (data[label].length === 0) {
      delete data[label];
    }
    setSelectedFilters(data);
  };
  useEffect(() => {
    if (moment(from).toISOString() !== moment(to).toISOString()) {
      const data = {...selectedFilters};
      data['lead_assign_time'] = [from, to];
      setSelectedFilters(data);
    }
  }, [from, to]);

  const onSubmit = () => {
    dispatcher(setActiveFilters(selectedFilters));
    navigation.goBack();
  };

  const onClear = () => {
    dispatcher(setActiveFilters({}));
    setSelectedFilters({});
  };

  const FilterOption = ({
    index,
    filterValue,
  }: {
    index: number;
    filterValue: string;
  }) => {
    return (
      <View key={index + filterValue} style={styles.filterValueView}>
        <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
          <CheckBox
            animationDuration={0.2}
            onValueChange={(checked) => onSelect(filterValue, checked)}
            value={
              selectedFilters[label]
                ? selectedFilters[label].includes(filterValue)
                : false
            }
          />
        </View>
        <Text style={styles.valueText}>{filterValue}</Text>
      </View>
    );
  };

  return (
    <>
      <Header title={'Filter'} onBack={() => navigation.goBack()}>
        <TouchableOpacity style={styles.clearFilter} onPress={onClear}>
          <Text style={styles.clearFilterText}>Clear Filters</Text>
        </TouchableOpacity>
      </Header>
      <View style={styles.parent}>
        <ScrollView
          style={styles.filterLabels}
          contentContainerStyle={{paddingBottom: 60}}>
          {Object.keys(FilterList).map((value: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={
                selectedLabel.index === index
                  ? [styles.labelButton, {backgroundColor: '#fff'}]
                  : styles.labelButton
              }
              onPress={() => setSelectedLabel({index, value})}>
              <Text
                style={
                  selectedLabel.index === index
                    ? [styles.labelText, {color: theme.colors.PRIMARY}]
                    : styles.labelText
                }>
                {value}
              </Text>
              {activeFilters[FilterList[value]] !== undefined && (
                <View style={styles.dot} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {label === 'lead_assign_time' ? (
          <View style={[styles.filterValues, {paddingHorizontal: '5%'}]}>
            {Platform.OS === 'android' ? (
              <DateTime
                style={styles.inputView}
                title={'From'}
                setDate={setFrom}
                date={from}
                titleStyle={styles.headStyle}
                dateFormat={getFilterDate}
                noMinDate
              />
            ) : (
              <DateTimeIOS
                style={styles.inputView}
                title={'From'}
                setDate={setFrom}
                date={from}
                titleStyle={styles.headStyle}
                dateFormat={getFilterDate}
              />
            )}
            {Platform.OS === 'android' ? (
              <DateTime
                style={styles.inputView}
                title={'To'}
                setDate={setTo}
                date={to}
                titleStyle={styles.headStyle}
                dateFormat={getFilterDate}
                noMinDate
              />
            ) : (
              <DateTimeIOS
                style={styles.inputView}
                title={'To'}
                setDate={setTo}
                date={to}
                titleStyle={styles.headStyle}
                dateFormat={getFilterDate}
              />
            )}
          </View>
        ) : (
          <>
            {filterValues && filterValues.length !== 0 ? (
              <FlatList
                style={styles.filterValues}
                contentContainerStyle={{paddingTop: 10, paddingBottom: 60}}
                keyExtractor={(item, index) => index.toString()}
                data={filterValues}
                renderItem={({item, index}) => (
                  <FilterOption index={index} filterValue={item} />
                )}
              />
            ) : (
              <View style={styles.noFilter}>
                <Icon name={'funnel'} color={'#000'} size={70} />
                <Text>No Filters</Text>
              </View>
            )}
          </>
        )}

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.applyButton} onPress={onSubmit}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  clearFilter: {
    marginLeft: 'auto',
  },
  clearFilterText: {
    fontSize: 15,
    color: '#ffffff',
    opacity: 0.8,
  },
  parent: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  filterLabels: {
    width: '36%',
    height: '100%',
    backgroundColor: '#F2F3F7',
  },
  filterValues: {
    width: '64%',
    height: '100%',
    backgroundColor: '#fff',
  },
  dot: {
    marginTop: 5,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.RED,
  },
  labelButton: {
    width: '100%',
    paddingVertical: 17,
    paddingHorizontal: 16,
    backgroundColor: '#F2F3F7',
  },
  labelText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 21,
  },
  filterValueView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical: 6,
  },
  valueText: {
    fontSize: 15,
    marginLeft: 5,
    flex: 1,
  },
  noFilter: {
    height: heightToDp(80),
    justifyContent: 'center',
    width: '64%',
    alignItems: 'center',
    alignSelf: 'center',
    opacity: 0.25,
  },
  bottomBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  applyButton: {
    marginLeft: 'auto',
    marginRight: '5%',
    width: '35%',
    backgroundColor: theme.colors.PRIMARY,
    paddingVertical: 8,
  },
  applyText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  inputView: {
    marginTop: 20,
  },
  headStyle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    leadFilterObject: state.filters.leadFilter,
    activeFilters: state.filters.activeFilters,
    permission: state.values?.orgConstants?.permission,
    type: state.leads.leadType,
  };
};
export default connect(mapStateToProps)(Filter);
