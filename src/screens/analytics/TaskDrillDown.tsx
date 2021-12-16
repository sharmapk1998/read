import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../../Components/HeaderSearch';
import {setActiveFilters, toggleSelectLeads} from '../../redux/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../../values/theme';
import {getTaskDrillDownData} from '../../Services/drilldown';
import {getTaskFilterValues} from '../../Services/tasksAPI';
import {arrangeTasks} from '../../Services/tasks';
import TaskView from '../../Components/TaskView';
import {fetchSingleLead} from '../../Services/leads';
import Snackbar from 'react-native-snackbar';

type props = {
  navigation: any;
  route: any;
  user: any;
  filters: any;
  sort: any;
  searchString: string;
};

const TaskDrillDown: FunctionComponent<props> = ({
  navigation,
  route,
  user,
  filters,
  sort,
  searchString,
}) => {
  const taskCount = route.params.taskCount;
  const {groupFeild, role} = route.params;
  const basicFilters = route.params.basicFilters
    ? route.params.basicFilters
    : {};
  let uid = route.params.uid;
  const [load, setLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatcher = useDispatch();
  const [finalDataList, setFinalDataList] = useState<any[]>([]);
  const [sectionData, setSectionData] = useState<{title: string; data: any}[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);
  const [momentum, setMomentum] = useState(false);

  useEffect(() => {
    return () => {
      dispatcher(setActiveFilters({}));
      dispatcher(toggleSelectLeads(false));
    };
  }, []);

  useEffect(() => {
    if (user.uid) {
      getTaskFilterValues(user.uid, dispatcher);
    }
  }, [user.uid]);

  useEffect(() => {
    if (user.uid) {
      setFinished(false);
      let localFilter = {...filters};
      localFilter = {...localFilter, ...basicFilters};
      getTaskDrillDownData(
        uid ? uid : user.uid,
        1,
        searchString !== '' ? searchString : searchQuery,
        localFilter,
        {[groupFeild]: sort['TASKS'] ? 1 : -1},
        role,
        (value) => setLoad(value),
        (data) => setFinalDataList(data),
        (value) => setFinished(value),
      );
    }
  }, [user.uid, searchQuery, sort, filters, searchString]);

  useEffect(() => {
    if (finished || page === 1) {
      return;
    }
    const oldData = [...finalDataList];
    let localFilter = {...filters};
    localFilter = {...localFilter, ...basicFilters};
    getTaskDrillDownData(
      uid ? uid : user.uid,
      page,
      searchString !== '' ? searchString : searchQuery,
      localFilter,
      {[groupFeild]: sort['TASKS'] ? 1 : -1},
      role,
      (value) => setLoad(value),
      (data) => setFinalDataList(oldData.concat(data)),
      (value) => setFinished(value),
    );
  }, [page]);

  useEffect(() => {
    let data: {title: string; data: any}[] = [];
    const arranged = arrangeTasks(finalDataList, groupFeild);
    Object.keys(arranged).forEach((key) => {
      data.push({
        title: key,
        data: arranged[key],
      });
    });
    setSectionData(data);
  }, [finalDataList]);

  const footerComponent = () => {
    return finished === false ? (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      </View>
    ) : (
      <></>
    );
  };

  const onTaskPress = async (leadId: string) => {
    const data:any = await fetchSingleLead(leadId);
    if(data.transfer_status===true)
    {Snackbar.show({
      text: "Task This Lead is Transferred, Can't access by you!!",
      duration: Snackbar.LENGTH_LONG,
    })}
    else
    {setLoad(true);
      setLoad(false);
      navigation.navigate('LeadDeatils', {
      leadData: {id: leadId, data},
    });}
  };
  
  const renderItem = ({item, index}: {item: any; index: number}) => {
    console.log(item)
    return (
      <TaskView
        task={item}
        key={index}
        index={index}
        onPress={() => item.transfer_status===true ?Snackbar.show({
          text: "This Lead is Transferred, Can't access by you!!",
          duration: Snackbar.LENGTH_LONG,
        }):onTaskPress(item.leadId)}
      />
    );
  };
  return (
    <>
      <Header
        title={'Drilldown Tasks'}
        onBack={() => navigation.goBack()}
        serachQuery={searchQuery}
        updateSearchQuery={(value: string) => setSearchQuery(value)}
        showSort
      />

      <View style={styles.parent}>
        {load === false && finalDataList.length !== 0 && (
          <SectionList
            keyboardShouldPersistTaps={'handled'}
            stickySectionHeadersEnabled={false}
            sections={sectionData}
            initialNumToRender={10}
            style={styles.listContainer}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              setMomentum(false);
            }}
            contentContainerStyle={{paddingBottom: 50}}
            onEndReached={() => {
              if (finished === false && momentum === false) {
                setPage(page + 1);
                setMomentum(true);
              }
            }}
            ListFooterComponent={footerComponent}
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.date}>{title}</Text>
            )}
          />
        )}
        {load === true && (
          <View style={styles.loadParent}>
            <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
          </View>
        )}
        {load === false && finalDataList.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.3,
            }}>
            <Icon
              name={'box-open'}
              size={90}
              color={theme.nav_colors.PRIMARY}
            />
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: theme.colors.GREY,
                fontWeight: 'bold',
              }}>
              No Tasks Available
            </Text>
          </View>
        )}
        <View style={styles.bottomBar}>
          <Text style={styles.totalText}>
            Total:{' '}
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {taskCount ? taskCount : 0}
            </Text>
          </Text>
        </View>
{/* } */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    marginBottom: 35,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 35,
    width: '100%',
    backgroundColor: '#4B4849',
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontWeight: 'bold',
    color: theme.colors.GREY,
    fontSize: 14,
    marginTop: 15,
    marginBottom: 10,
  },
  totalText: {
    marginLeft: 'auto',
    marginRight: '5%',
    color: '#fff',
    fontSize: 16,
    width: '35%',
    textAlign: 'right',
  },
  loadParent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customizeViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  footerLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    filters: state.filters.activeFilters,
    sort: state.filters.sort,
    searchString: state.filters.searchString,
  };
};
export default connect(mapStateToProps)(TaskDrillDown);
