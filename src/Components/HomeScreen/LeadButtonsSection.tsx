import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {updateLeadType} from '../../redux/actions';
import {getLocalLeadCount, setLocalLeadCounts} from '../../Services/leads';
import {LEAD_TYPE} from '../../values/customTypes';
import Loader from '../Modals/Loader';
import SearchBar from '../SearchBar';
import LeadButton from './LeadButton';

type props = {
  navigation: any;
  style?: ViewStyle;
  leadCount: any;
  user: any;
};

const LeadButtonsSection: FunctionComponent<props> = ({
  navigation,
  style,
  leadCount,
  user,
}) => {
  const dispatcher = useDispatch();
  const [localLeadCount, setLocalLeadCount] = useState({
    FRESH: 0,
    INTERESTED: 0,
    FOLLOWUP: 0,
    MISSED: 0,
    CALLBACK: 0,
    WON: 0,
    PROSPECT: 0,
  });

  const [search, setSearch] = useState('');
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const onFocusUnsubscribe = navigation.addListener('focus', () => {
      getLocalLeadCount(localLeadCount, (data) => setLocalLeadCount(data));
    });
    return onFocusUnsubscribe;
  }, []);

  const onPress = (leadType: LEAD_TYPE, title: string) => {
    setLocalLeadCounts(leadType, leadCount[leadType]);
    dispatcher(updateLeadType(leadType));
    if (
      leadType === 'CALLBACK' ||
      leadType === 'INTERESTED' ||
      leadType === 'MISSED'
    ) {
      navigation.navigate('Grouped Leads', {
        title,
      });
    } else {
      navigation.navigate('Leads', {
        title,
      });
    }
  };

  const onSearch = () => {
    if (search.length === 0) {
      return;
    }
    dispatcher(updateLeadType('SEARCH'));
    navigation.navigate('Leads', {
      title: 'Search Result',
      search,
    });
  };

  return (
    <View style={[styles.parent, style]}>
      {load && <Loader show={load} />}
      <SearchBar
        shadow
        inputProps={{
          value: search,
          onChangeText: (value: string) => setSearch(value),
        }}
        onSearch={onSearch}
      />
      <View style={[styles.buttons]}>
        <View style={styles.row}>
          <LeadButton
            title={'Fresh'}
            count={leadCount.FRESH}
            onPress={() => onPress('FRESH', 'Fresh Leads')}
            bgcolor={'#073B3A'}
            showBadge={localLeadCount.FRESH < leadCount.FRESH}
          />
          <LeadButton
            title={'Interested'}
            count={leadCount.INTERESTED}
            onPress={async () => onPress('INTERESTED', 'Interested Leads')}
            bgcolor={'#87CBAC'}
            textColor={'#000'}
            showBadge={localLeadCount.INTERESTED < leadCount.INTERESTED}
          />
          <LeadButton
            title={'Prospect'}
            count={leadCount.PROSPECT}
            onPress={() => onPress('PROSPECT', 'Prospect Leads')}
            bgcolor={'#FFB30F'}
            textColor={'#000'}
            showBadge={localLeadCount.PROSPECT < leadCount.PROSPECT}
          />
        </View>
        <View style={styles.row}>
          <LeadButton
            title={'Missed'}
            count={leadCount.MISSED}
            onPress={() => onPress('MISSED', 'Missed Leads')}
            bgcolor={'#EE6352'}
            showBadge={localLeadCount.MISSED < leadCount.MISSED}
          />
          <LeadButton
            title={'Call Back'}
            count={leadCount.CALLBACK}
            onPress={async () => onPress('CALLBACK', 'Call Back Leads')}
            bgcolor={'#51716A'}
            showBadge={localLeadCount.CALLBACK < leadCount.CALLBACK}
          />
          <LeadButton
            title={'Won'}
            count={leadCount.WON}
            onPress={() => onPress('WON', 'Won Leads')}
            bgcolor={'#75DDDD'}
            textColor={'#000'}
            showBadge={localLeadCount.WON < leadCount.WON}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    backgroundColor: '#fff',
  },
  buttons: {
    height: 245,
    justifyContent: 'space-evenly',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

const mapStateToProps = (state: any) => {
  return {
    leadCount: state.leadCount.allLeadCounts,
    user: state.user,
  };
};

export default connect(mapStateToProps)(LeadButtonsSection);
