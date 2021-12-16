import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../../Components/HeaderSearch';
import {arrangeLeads, converLeadData} from '../../Services/leads';
import {
  setActiveFilters,
  setGlobalRefresh,
  setSelectedLeads,
  toggleSelectLeads,
} from '../../redux/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../../values/theme';
import LeadView from '../../Components/LeadView';
import {getFilterValues} from '../../Services/contactsAPI';
import {getDrillDownData} from '../../Services/drilldown';
import Snackbar from 'react-native-snackbar';
import {fetchSingleLead} from '../../Services/leads';

type props = {
  navigation: any;
  route: any;
  user: any;
  leads: any;
  filters: any;
  sort: any;
  searchString: string;
  globalRefresh: boolean;
};

const DrillDown: FunctionComponent<props> = ({
  navigation,
  route,
  user,
  leads,
  filters,
  sort,
  searchString,
  globalRefresh,
}) => {
  const leadCount = route.params.leadCount;
  const role = route.params.role;
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
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    return () => {
      dispatcher(setActiveFilters({}));
      dispatcher(toggleSelectLeads(false));
      dispatcher(setSelectedLeads([]));
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
    };
  }, []);
// console.log(user.role)
  useEffect(() => {
    if (user.uid) {
      getFilterValues(user.uid, leads.leadType, dispatcher);
    }
  }, [leads.leadType, user.uid]);

  useEffect(() => {
    if (user.uid) {
      setFinished(false);
      let localFilter = {...filters};
      localFilter = {...localFilter, ...basicFilters};
      getDrillDownData(
        uid ? uid : user.uid,
        1,
        searchString !== '' ? searchString : searchQuery,
        localFilter,
        {lead_assign_time: sort[leads.leadType] ? -1 : 1},
        role,
        (value) => setLoad(value),
        (data) => setFinalDataList(data),
        (value) => setFinished(value),
      );
    }
  }, [
    leads.leadType,
    user.uid,
    searchQuery,
    sort,
    filters,
    searchString,
    refresh,
  ]);

  useEffect(() => {
    if (finished || page === 1) {
      return;
    }
    const oldData = [...finalDataList];
    let localFilter = {...filters};
    localFilter = {...localFilter, ...basicFilters};
    getDrillDownData(
      uid ? uid : user.uid,
      page,
      searchString !== '' ? searchString : searchQuery,
      localFilter,
      {lead_assign_time: sort[leads.leadType] ? 1 : -1},
      role,
      (value) => setLoad(value),
      (data) => setFinalDataList(oldData.concat(data)),
      (value) => setFinished(value),
    );
  }, [leads.leadType,
    user.uid,
    searchQuery,
    sort,
    filters,
    searchString,
    refresh]);

  useEffect(() => {
    let data: {title: string; data: any}[] = [];
    const arranged = arrangeLeads(finalDataList);
    Object.keys(arranged).forEach((key) => {
      data.push({
        title: key,
        data: arranged[key],
      });
    });
    setSectionData(data);
  }, [finalDataList]);

  useEffect(() => {
    if (globalRefresh) {
      setRefresh(!refresh);
      dispatcher(setGlobalRefresh(false));
    }
  }, [globalRefresh]);

  const footerComponent = () => {
    return finished === false ? (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      </View>
    ) : (
      <></>
    );
  };

  const onLeadPress = async (item: any) => {
    if(item.data.transfer_status===true)
    {Snackbar.show({
      text: "This Lead is Transferred, Can't access by you!!",
      duration: Snackbar.LENGTH_LONG,
    })}
    else
    {
      navigation.navigate('LeadDeatils', {
        leadData: converLeadData(item),}
      );}
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    console.log("lead-ty",item)
    return (
      <LeadView
        role={user.role}
        lead={item}
        key={index}
        index={index}
        leadType={leads.leadType}
        onPress={() =>onLeadPress(item)}
      />
    );
  };
  return (
    <>
      <Header
        title={'Drilldown Leads'}
        onBack={() => navigation.goBack()}
        serachQuery={searchQuery}
        updateSearchQuery={(value: string) => setSearchQuery(value)}
        menu
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
              No Leads Available
            </Text>
          </View>
        )}
       { (user.role === 'Lead Manager')?
       (
          <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.customizeViewContainer}
            onPress={() =>
              navigation.navigate('CustomizeLeadView', {
                stage: leads.leadType,
              })
            }>
            <Icon
              name={'edit'}
              size={15}
              style={{marginRight: 6}}
              color={theme.colors.PRIMARY}
            />
            <Text style={{fontSize: 13, color: '#FFF'}}>
              Customize Lead View
            </Text>
          </TouchableOpacity>
          <Text style={styles.totalText}>
            Total:{' '}
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {leadCount ? leadCount : 0}
            </Text>
          </Text>
        </View>
       ): 
       <View style={styles.bottomBar}>
          <Text style={styles.totalText}>
            Total:{' '}
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {leadCount ? leadCount : 0}
            </Text>
          </Text>
        </View>
     }
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
    leads: state.leads,
    filters: state.filters.activeFilters,
    sort: state.filters.sort,
    searchString: state.filters.searchString,
    globalRefresh: state.refresh.refresh,
  };
};
export default connect(mapStateToProps)(DrillDown);
