import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, Platform} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CommunicationIcons from '../Components/CommunicationIcons';
import Header from '../Components/Header';
import {customFieldsData} from '../values/dataTemplate';
import theme from '../values/theme';
import CheckBox from '@react-native-community/checkbox';
import {updateLeadView} from '../Services/user';
import {useEffect} from 'react';
import {connect} from 'react-redux';
import Loader from '../Components/Modals/Loader';
import {properFormat} from '../Services/format';
import Icon from 'react-native-vector-icons/Ionicons';

type props = {
  navigation: any;
  route: any;
  user: any;
  permission: any;
};

const CustomizeLeadView: FunctionComponent<props> = ({
  navigation,
  route,
  user,
  permission,
}) => {
  const selectedStage: string = properFormat(route.params.stage);
  console.log(selectedStage);
  const [load, setLoad] = useState(false);
  const [fields, setFields] = useState<{[key: string]: string[]}>({
    Fresh: [],
    Interested: [],
    Prospect: [],
    Missed: [],
    'Call Back': [],
    Won: [],
    Drilldown: [],
  });
  const [dataFields, setDataFields] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (user.leadView) {
      if (
        user.leadView.Prospect === undefined ||
        user.leadView.Drilldown === undefined
      ) {
        user.leadView.Prospect = [];
        user.leadView.Drilldown = [];
      }
      setFields(user.leadView);
    }
  }, [user.leadView]);

  useEffect(() => {
    if (user.role === 'Lead Manager') {
      setDataFields(customFieldsData);
    }
    if (permission && permission[user.role]) {
      let userPermission: string[] = permission[user.role];
      let data: {[key: string]: string} = {};
      Object.keys(customFieldsData).forEach((key) => {
        if (userPermission.includes(key)) {
          data[key] = customFieldsData[key];
        }
      });
      setDataFields(data);
    }
  }, [permission]);

  const setField = (field: string, selected: boolean) => {
    let tempState = {...fields};
    if (selected) {
      if (tempState[selectedStage].length <= 4) {
        tempState[selectedStage].push(field);
        setFields(tempState);
      } else {
      }
    } else {
      var index = tempState[selectedStage].indexOf(field);
      if (index > -1) {
        tempState[selectedStage].splice(index, 1);
        setFields(tempState);
      }
    }
  };

  return (
    <>
      <Loader show={load} />
      <Header
        title={'Customize Lead View'}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.parent}>
        <View style={styles.leadViewParent}>
          <View style={styles.textParent}>
            <Text style={styles.head} numberOfLines={2}>
              {selectedStage !== 'Select'
                ? fields[selectedStage][0]
                  ? fields[selectedStage][0]
                  : ''
                : 'Customer Name'}
            </Text>
            <Text style={styles.subHead}>
              {selectedStage !== 'Select'
                ? fields[selectedStage][1]
                  ? fields[selectedStage][1]
                  : ''
                : 'Project'}
            </Text>
            <Text style={styles.stage}>
              {selectedStage !== 'Select'
                ? fields[selectedStage][2]
                  ? fields[selectedStage][2]
                  : ''
                : 'Owner'}
            </Text>
          </View>
          <View style={styles.iconViewFollwUp}>
            <CommunicationIcons size={7.2} lead={{}} leadId={''} disabled />
            <Text style={styles.stage}>
              {selectedStage !== 'Select'
                ? fields[selectedStage][3]
                  ? fields[selectedStage][3]
                  : ''
                : 'Follow Up Type'}
            </Text>
          </View>
        </View>

        {Object.keys(dataFields).length !== 0 ? (
          <>
            <View style={{marginTop: 30}}>
              <Text style={styles.headStyle}>Fields</Text>

              <ScrollView style={styles.fieldScrollView}>
                {Object.keys(dataFields).map((key, index) => (
                  <View key={index} style={styles.fieldValueView}>
                    <View
                      style={
                        Platform.OS === 'ios' && {transform: [{scale: 0.8}]}
                      }>
                      <CheckBox
                        disabled={
                          !fields[selectedStage].includes(key) &&
                          fields[selectedStage].length === 4
                        }
                        value={fields[selectedStage].includes(key)}
                        animationDuration={0.2}
                        onValueChange={(value) => setField(key, value)}
                      />
                    </View>
                    <Text style={styles.valueText}>{key}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                setLoad(true);
                await updateLeadView(fields, user);
                setLoad(false);
              }}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noDataView}>
            <Icon
              name={'alert-circle-outline'}
              size={90}
              color={theme.nav_colors.PRIMARY}
            />
            <Text style={styles.noDataText}>No Permission Granted</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: '5%',
  },
  leadViewParent: {
    width: '100%',
    minHeight: 75,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  textParent: {
    marginStart: '3%',
    width: '56%',
    paddingVertical: 10,
  },
  head: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHead: {
    color: theme.colors.GREY,
    marginTop: 5,
    fontSize: 14,
  },
  stage: {
    fontSize: 12,
    color: theme.colors.GREY,
    marginTop: 5,
  },
  iconViewFollwUp: {
    width: '35%',
    marginLeft: 'auto',
    marginRight: '2.5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 6,
  },
  headStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputView: {
    marginTop: 20,
  },
  fieldScrollView: {
    marginTop: 10,
    height: '70%',
  },
  fieldValueView: {
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
  saveButton: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: '5%',
    width: '35%',
    backgroundColor: theme.colors.PRIMARY,
    paddingVertical: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
    marginTop: 'auto',
    marginBottom: 'auto',
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
    user: state.user,
    permission: state.values?.orgConstants?.permission,
  };
};
export default connect(mapStateToProps)(CustomizeLeadView);
