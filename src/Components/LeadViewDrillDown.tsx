import React, {FunctionComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {LEAD_TYPE} from '../values/customTypes';
import IconArray from '../Components/CommunicationIcons';
import theme from '../values/theme';
import {connect, useDispatch} from 'react-redux';
import {properFormat} from '../Services/format';
import {getFeildData} from '../Services/leads';
import {toLocalDate} from '../Services/leads';
import CheckBox from '@react-native-community/checkbox';
import {setSelectedLeads, toggleSelectLeads} from '../redux/actions';
import Snackbar from 'react-native-snackbar';

type props = {
  lead: any;
  index: number;
  onPress: () => void;
  leadType: LEAD_TYPE;
  role: string;
  user: any;
  selectLeads: boolean;
  selectedLeads: string[];
};

const LeadViewDrillDown: FunctionComponent<props> = ({
  index,
  lead,
  leadType,
  onPress,
  role,
  user,
  selectLeads,
  selectedLeads,
}) => {
  const users: any[] = user.organization_users ? user.organization_users : [];
  const dispatcher = useDispatch();
  const selectedUser = users.filter((user) => user.uid === lead.data.uid);
  const owner = selectedUser.length === 0 ? '' : selectedUser[0].user_name;
  const leadFieldsData = user?.leadView;
  const leadFields = leadFieldsData
    ? leadFieldsData[properFormat(leadType)]
    : undefined;

  const onSelectLead = (checked: boolean) => {
    let tempSelected = [...selectedLeads];
    if (checked) {
      tempSelected.push({...lead.data, id: lead.id});
    } else {
      let index = -1;
      tempSelected.forEach((leadData: any, indexValue) => {
        if (leadData.id === lead.id) {
          index = indexValue;
        }
      });
      if (index > -1) {
        tempSelected.splice(index, 1);
      }
    }
    if (tempSelected.length === 0) {
      dispatcher(toggleSelectLeads(false));
    }
    dispatcher(setSelectedLeads(tempSelected));
  };

  const onLongPress = () => {
    if (selectLeads === false && user.role !== 'Sales') {
      dispatcher(toggleSelectLeads());
      dispatcher(setSelectedLeads([{...lead.data, id: lead.id}]));
    }
  };
  console.log(lead)
  return (
    
    <View
      style={
        index == 0
          ? [styles.leadViewParent]
          : [styles.leadViewParent, styles.border]
      }>
      {selectLeads === true && lead.data.transfer_status === false && (
        <View style={styles.checkboxParent}>
          <CheckBox
            animationDuration={0.2}
            onValueChange={(value) => onSelectLead(value)}
            value={
              selectedLeads.filter((data: any) => data.id === lead.id)
                .length === 1
            }
          />
        </View>
      )}
    
    {/* {leadFields ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {getFeildData(lead, 0, leadFields)}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {getFeildData(lead, 1, leadFields)}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {getFeildData(lead, 2, leadFields)}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {getFeildData(lead, 3, leadFields)}
            </Text>
          </View>
        </>
      ) :<></>} */}
      {lead.data.stage==='CALLBACK'? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.call_back_reason}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.next_follow_up_date_time)}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.project}
            </Text>
          </View>
        </>
      ) :<></>}
      {lead.data.stage==='FRESH'  ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.project}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.budget}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.lead_assign_time)}
            </Text>
          </View>
        </>
      ) :<></>}
      {lead.data.stage==='INTERESTED'  ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.project}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.next_follow_up_type}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.next_follow_up_date_time)}
            </Text>
          </View>
        </>
      ) :<></>}
      {lead.data.stage==='WON'  ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.project}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.budget}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.stage_change_at)}
            </Text>
          </View>
        </>
      ) :<></>}
      {lead.data.stage==='NOT INTERESTED'  ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.not_int_reason}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.project}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.stage_change_at)}
            </Text>
          </View>
        </>
      ) :<></>}
      {lead.data.stage==='LOST'  ? (
        <>
          <TouchableOpacity
            style={
              selectLeads
                ? [styles.textParent, {width: '45%'}]
                : styles.textParent
            }
            onPress={onPress}
            onLongPress={() => onLongPress()}
            delayLongPress={500}>
            <Text style={styles.head} numberOfLines={2}>
              {lead.data.customer_name}
            </Text>

            <Text style={styles.subHead} numberOfLines={1}>
              {lead.data.other_lost_reason}
            </Text>

            <Text style={styles.stage} numberOfLines={1}>
              {lead.data.project}
            </Text>
          </TouchableOpacity>
          <View style={styles.iconViewFollwUp}>
            <IconArray size={7.2} lead={lead.data} leadId={lead.id} />
            <Text style={styles.stage} numberOfLines={1}>
              {toLocalDate(lead.data.stage_change_at)}
            </Text>
          </View>
        </>
      ) :<></>}
    </View>
  );
};

const styles = StyleSheet.create({
  leadViewParent: {
    width: '100%',
    minHeight: 75,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  border: {
    borderTopWidth: 0.7,
    borderColor: theme.colors.GREY_LIGHT,
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
  iconView: {
    width: '35%',
    marginLeft: 'auto',
    marginRight: '2.5%',
    height: 75,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iconViewFollwUp: {
    width: '35%',
    marginLeft: 'auto',
    marginRight: '2.5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: '4%',
    paddingBottom: 10,
  },
  checkboxParent: {
    transform: Platform.OS === 'ios' ? [{scale: 0.65}] : [{scale: 0.8}],
    alignSelf: 'center',
    marginLeft: 2,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    selectLeads: state.leads.selectLeads,
    selectedLeads: state.leads.selectedLeads,
  };
};

export default connect(mapStateToProps)(LeadViewDrillDown);
