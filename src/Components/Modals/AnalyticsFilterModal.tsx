import React, {FunctionComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {connect, useDispatch} from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import {Platform} from 'react-native';
import {setAnalyticsFilter} from '../../redux/actions';
import {useState} from 'react';
import Loader from './Loader';

type props = {
  onBack: () => void;
  show: boolean;
  analyticsFilter: any;
  user: any;
};
const AnalyticsFilterModal: FunctionComponent<props> = ({
  onBack,
  show,
  analyticsFilter,
  user,
}) => {
  const dispatcher = useDispatch();
  const [load, setLoad] = useState(false);
  const onSelect = (value: boolean) => {
    onBack();
    setLoad(true);
    setTimeout(() => {
      let filter = {...analyticsFilter};
      filter.teamWise = value;
      dispatcher(setAnalyticsFilter(filter));
      setLoad(false);
    }, 10);
  };

  const onChnageType = (value: string) => {
    onBack();
    setLoad(true);
    setTimeout(() => {
      let filter = {...analyticsFilter};
      filter.analyticsType = value;
      dispatcher(setAnalyticsFilter(filter));
      setLoad(false);
    }, 10);
  };
  return (
    <>
      <Loader show={load} />
      <Modal
        useNativeDriver={true}
        isVisible={show}
        onBackButtonPress={onBack}
        onBackdropPress={onBack}
        style={styles.parent}>
        <View style={styles.dialogue}>
          <Text style={styles.head}>Filters</Text>
          {/* {user.role === 'Lead Manager' && (
            <View style={styles.filterRow}>
              <View
                style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
                <CheckBox
                  animationDuration={0.2}
                  onValueChange={onSelect}
                  value={analyticsFilter.teamWise}
                />
              </View>
              <Text style={styles.filterText}>Team Wise</Text>
            </View>
          )} */}

          <View style={styles.filterRow}>
            <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
              <CheckBox
                animationDuration={0.2}
                onValueChange={() => onChnageType('All')}
                value={analyticsFilter.analyticsType === 'All'}
              />
            </View>
            <Text style={styles.filterText}>All</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
              <CheckBox
                animationDuration={0.2}
                onValueChange={() => onChnageType('T')}
                value={analyticsFilter.analyticsType === 'T'}
              />
            </View>
            <Text style={styles.filterText}>Today</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
              <CheckBox
                animationDuration={0.2}
                onValueChange={() => onChnageType('Y')}
                value={analyticsFilter.analyticsType === 'Y'}
              />
            </View>
            <Text style={styles.filterText}>Yesterday</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
              <CheckBox
                animationDuration={0.2}
                onValueChange={() => onChnageType('MTD')}
                value={analyticsFilter.analyticsType === 'MTD'}
              />
            </View>
            <Text style={styles.filterText}>Month Till Date</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={Platform.OS === 'ios' && {transform: [{scale: 0.8}]}}>
              <CheckBox
                animationDuration={0.2}
                onValueChange={() => onChnageType('PM')}
                value={analyticsFilter.analyticsType === 'PM'}
              />
            </View>
            <Text style={styles.filterText}>Previous Month</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    margin: 0,
  },
  head: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogue: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 310,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: '3%',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: '2%',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 15,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(AnalyticsFilterModal);
