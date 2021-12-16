import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  // SomeComponent,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../Components/HeaderSearch';
import {arrangeLeads, converLeadData} from '../Services/leads';
import AddButton from '../Components/AddButton';
import {
  setActiveFilters,
  setGlobalRefresh,
  setSelectedLeads,
  toggleSelectLeads,
  setRemoteNotification,
} from '../redux/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../values/theme';
import LeadView from '../Components/LeadView';
import {fetchContacts, getFilterValues} from '../Services/contactsAPI';
import Snackbar from 'react-native-snackbar';

const Leads = ({
  navigation,
  route,
  user,
  leads,
  filters,
  sort,
  leadCount,
  searchString,
  globalRefresh,
  remoteNotification,
  leadslength,
}: any) => {
  const title = route.params.title;
  const search = route.params.search;
  const basicFilters = route.params.basicFilters
    ? route.params.basicFilters
    : {};
  const [load, setLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatcher = useDispatch();
  const [finalDataList, setFinalDataList] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
      dispatcher(setSelectedLeads([]));
    };
  }, []);

  useEffect(() => {
    if (user.uid && Object.keys(basicFilters).length === 0) {
      getFilterValues(user.uid, leads.leadType, dispatcher);
    }
  }, [leads.leadType, user.uid]);

  useEffect(() => {
    if (remoteNotification) {
      dispatcher(setRemoteNotification(false));
    }
  }, [remoteNotification]);

  useEffect(() => {
    if (user.uid) {
      setFinished(false);
      let A = {};
      let localFilter = {...filters};
      if (search === undefined) {
        localFilter['stage'] = [leads.leadType];
      }
      localFilter = {...localFilter, ...basicFilters};
      fetchContacts(
        user.uid,
        1,
        search ? search : searchString !== '' ? searchString : searchQuery,
        localFilter,
        sort,leads.leadType,
        leads.leadType === 'MISSED',
        (value) => setLoad(value),
        (data) => setFinalDataList(data),
        (value) => setFinished(value),
        leads.leadType === 'PROSPECT',
        
      );
    }
  }, [
    leads.leadType,
    user.uid,
    searchQuery,
    sort,
    filters,
    refresh,
    searchString,
  ]);

  useEffect(() => {
    if (finished || page === 1) {
      return;
    }
    const oldData = [...finalDataList];
    let localFilter = {...filters};
    if (search === undefined) {
      localFilter['stage'] = [leads.leadType];
    }
    localFilter = {...localFilter, ...basicFilters};
    fetchContacts(
      user.uid,
      page,
      search ? search : searchString !== '' ? searchString : searchQuery,
      localFilter,
      sort,leads.leadType,
      leads.leadType === 'MISSED',
      (value) => setLoad(value),
      (data) => setFinalDataList(oldData.concat(data)),
      (value) => setFinished(value),
      leads.leadType === 'PROSPECT',
    );
  }, [page]);

  useEffect(() => {
    if (load === false) {
      setRefreshing(false);
    }
  }, [load]);

  useEffect(() => {
    if (globalRefresh) {
      setRefresh(!refresh);
      setRefreshing(true);
      dispatcher(setGlobalRefresh(false));
    }
  }, [globalRefresh]);

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

  const footerComponent = () => {
    return finished === false ? (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      </View>
    ) : (
      <></>
    );
  };

  const secCount = () => {
    // console.log(leadCount[leads.leadType])
    return (
      <View style={{  alignSelf:"flex-end" }}>
          <Text style={styles.totalText1}>
              Total:{' '}
               <Text style={{ fontWeight: 'bold', color: '#000' }}>
               {finalDataList.length}
               </Text>
          </Text>
      </View>
    ) 
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    // console.log(item)
    return (
      <LeadView
        role={user.role}
        lead={item}
        key={index}
        index={index}
        leadType={leads.leadType}
        onPress={() =>item.transfer_status===true ?Snackbar.show({
          text: "This Lead is Transferred, Can't access by you!!",
          duration: Snackbar.LENGTH_LONG,
        }):
          navigation.navigate('LeadDeatils', {
            leadData: converLeadData(item),
          })
        }
      />
    );
  };
  // console.log(leads)
  return (
    <>
      {(leads.leadType === 'FRESH' ||
        leads.leadType === 'WON' ||
        leads.leadType === 'SEARCH' ||
        leads.leadType === 'PROSPECT') && (
        <Header
          title={title}
          onBack={() => navigation.goBack()}
          serachQuery={searchQuery}
          updateSearchQuery={(value: string) => setSearchQuery(value)}
          menu
          showSort
        />
      )}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefresh(!refresh);
                  setRefreshing(true);
                }}
              />
            }
            renderSectionHeader={({section: {title}}) => (
              <Text style={styles.date}>{title}</Text>
            )}
          /> 
        )}
        {finished===true &&(
            secCount()
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
        <View style={styles.bottomBar}>
          {leads.leadType !== 'SEARCH' && (
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
          )}
          <Text style={styles.totalText}>
            Total:{' '}
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {leadCount[leads.leadType] ? leadCount[leads.leadType] : 0}
            </Text>
          </Text>
        </View>
      </View>
      {leads.leadType === 'FRESH' && <AddButton navigation={navigation} />}
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
    marginBottom: 10,
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
  totalText1: {
    marginLeft: 'auto',
    marginRight: '5%',
    marginBottom: '11%',
    color: '#000',
    fontSize: 16,
    width: '25%',
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
    leadCount: state.leadCount.allLeadCounts,
    filters: state.filters.activeFilters,
    sort: state.filters.sort,
    searchString: state.filters.searchString,
    globalRefresh: state.refresh.refresh,
    remoteNotification: state.notification.remoteNotification,
  };
};
export default connect(mapStateToProps)(Leads);
