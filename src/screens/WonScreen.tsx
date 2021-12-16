import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../Components/Header';
import Loader from '../Components/Modals/Loader';
import {changeLeadStage, updateLeadCountState} from '../Services/leads';
import {modifyTaskStatus} from '../Services/tasks';
import theme from '../values/theme';

type props = {
  navigation: any;
  route: any;
  tasks: {[key: string]: any};
};

const WonScreen: FunctionComponent<props> = ({navigation, route, tasks}) => {
  const leadData = route.params.leadData;
  const leadId = route.params.leadId;
  const initial = new Date();
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const [load, setLoad] = useState(false);
  const dispatcher = useDispatch();

  const onSubmit = () => {
    changeLeadStage(
      leadId,
      {stage: 'WON'},
      (value) => setLoad(value),
      navigation,
      dispatcher,
      {
        status: 'INACTIVE',
        tasks: modifyTaskStatus(tasksData),
      },
      () => updateLeadCountState(leadData.stage, 'WON', dispatcher),
    );
  };

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Won Details'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MARK THE LEAD AS WON?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonTitle}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonTitle}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: 30,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleContainer: {
    backgroundColor: theme.colors.GREY_BACKGROUND,
    paddingHorizontal: '5%',
    paddingVertical: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 50,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: theme.colors.PRIMARY,
    paddingHorizontal: 27,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: any) => {
  return {
    tasks: state.tasks,
  };
};
export default connect(mapStateToProps)(WonScreen);
