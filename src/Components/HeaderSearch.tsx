import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect, useDispatch} from 'react-redux';
import {setSelectedLeads, setSort, toggleSelectLeads} from '../redux/actions';
import {heightToDp, widthToDp} from '../values/size';
import theme from '../values/theme';
import FaIcon from 'react-native-vector-icons/FontAwesome5';
import EditModal from './Modals/EditModal';

type props = {
  title: string;
  onBack?: () => void;
  serachQuery: string;
  updateSearchQuery: (value: string) => void;
  placeHolder?: string;
  activeFilters: {[key: string]: string[]};
  hideFilter?: boolean;
  menu?: boolean;
  showSort?: boolean;
  selectLeads: boolean;
  selectedLeads: string[];
  user: any;
  sort: any;
  leadType: any;
};
const HeaderSearch: FunctionComponent<props> = ({
  title,
  onBack,
  serachQuery,
  updateSearchQuery,
  placeHolder,
  activeFilters,
  hideFilter,
  menu,
  showSort,
  selectLeads,
  selectedLeads,
  user,
  sort,
  leadType,
}) => {
  const navigation = useNavigation();
  const [showSearchBar, setShowSearch] = useState(false);
  const textInputRef: any = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchString, setSearchString] = useState('');
  const dispatcher = useDispatch();
  const onMultiSelect = () => {
    if (selectLeads === true) {
      dispatcher(setSelectedLeads([]));
    }
    dispatcher(toggleSelectLeads());
    setShowMenu(false);
  };
  return (
    <>
      <EditModal onBack={() => setShowEditModal(false)} show={showEditModal} />
      <View style={styles.parent}>
        <TouchableOpacity onPress={onBack}>
          <Icon name={'arrow-back-outline'} color={'#fff'} size={24} />
        </TouchableOpacity>
        {showSearchBar === false && (
          <>
            {selectLeads === false ? (
              <>
                <Text style={styles.heading}>{title}</Text>
                <TouchableOpacity
                  style={styles.search}
                  onPress={() => {
                    setShowSearch(true);
                    setTimeout(() => textInputRef?.current?.focus(), 100);
                  }}>
                  <Icon name={'search-outline'} size={23} color={'#fff'} />
                </TouchableOpacity>

                {hideFilter !== true && (
                  <TouchableOpacity
                    style={styles.iconStyle}
                    onPress={() => navigation.navigate('Filter')}>
                    <Icon name={'funnel'} color={'#fff'} size={18} />
                    {Object.keys(activeFilters).length !== 0 && (
                      <View style={styles.dot} />
                    )}
                  </TouchableOpacity>
                )}
                {showSort && (
                  <TouchableOpacity
                    style={styles.iconStyle}
                    onPress={() =>
                      dispatcher(setSort({[leadType]: !sort[leadType]}))
                    }>
                    <FaIcon
                      name={
                        sort[leadType]
                          ? 'sort-amount-down'
                          : 'sort-amount-up-alt'
                      }
                      color={'#fff'}
                      size={18}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <Text
                  style={
                    styles.heading
                  }>{`${selectedLeads.length} leads selected`}</Text>
                <TouchableOpacity
                  style={{marginLeft: 'auto', paddingRight: '1%'}}
                  onPress={() => setShowEditModal(true)}>
                  <FaIcon name={'pen'} color={'#fff'} size={18} />
                </TouchableOpacity>
              </>
            )}
            {menu === true && user.role !== 'Sales' && (
              <TouchableOpacity
                style={styles.iconStyle}
                onPress={() => setShowMenu(!showMenu)}>
                <Icon name={'ellipsis-vertical'} color={'#fff'} size={18} />
              </TouchableOpacity>
            )}
          </>
        )}
        {showSearchBar === true && (
          <>
            <TextInput
              ref={textInputRef}
              placeholder={
                placeHolder ? placeHolder : 'Client Name or Mobile No.'
              }
              placeholderTextColor={theme.colors.PLACEHOLDER}
              style={styles.serchBar}
              value={searchString}
              onChangeText={(value) => setSearchString(value)}
              onSubmitEditing={() => {
                updateSearchQuery(searchString);
              }}
            />
            {searchString !== serachQuery && searchString !== '' ? (
              <TouchableOpacity
                style={styles.cancaleButton}
                onPress={() => {
                  updateSearchQuery(searchString);
                }}>
                <Text style={styles.cancelText}>Search</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.cancaleButton}
                onPress={() => {
                  setShowSearch(false);
                  updateSearchQuery('');
                  setSearchString('');
                }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {showMenu && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.option} onPress={onMultiSelect}>
            <Text style={styles.optionText}>Multi Transfer</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: theme.nav_colors.PRIMARY,
    height: Platform.OS == 'ios' ? 55 + heightToDp(3.8) : 55,
    width: '100%',
    paddingLeft: '4%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: Platform.OS == 'ios' ? heightToDp(3.8) : 0,
    zIndex: 2,
  },
  heading: {
    color: '#fff',
    marginLeft: '5%',
    fontSize: 19,
  },
  search: {
    marginLeft: 'auto',
    marginRight: '2%',
  },
  serchBar: {
    backgroundColor: '#fff',
    marginLeft: '3%',
    width: '70%',
    paddingHorizontal: 15,
    paddingVertical: '1.5%',
    borderRadius: 20,
  },
  cancaleButton: {
    marginLeft: 'auto',
    marginRight: '2%',
  },
  cancelText: {
    color: '#fff',
    fontSize: 15,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: theme.colors.RED,
    right: 2,
    top: -2,
  },
  menuContainer: {
    position: 'absolute',
    right: 5,
    top: Platform.OS == 'ios' ? heightToDp(3.8) + 48 : 48,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
  },
  iconStyle: {
    paddingHorizontal: '2%',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    activeFilters: state.filters.activeFilters,
    selectLeads: state.leads.selectLeads,
    selectedLeads: state.leads.selectedLeads,
    sort: state.filters.sort,
    leadType: state.leads.leadType,
  };
};
export default connect(mapStateToProps)(HeaderSearch);
