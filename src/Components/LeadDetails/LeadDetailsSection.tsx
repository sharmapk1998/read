import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {inActiveStages} from '../../Services/contactsAPI';
import {widthToDp} from '../../values/size';
import theme from '../../values/theme';
import CustomButton from '../CustoButton';
import KeyValue from './KeyValue';

type props = {
  leadData: any;
  leadId: string;
  navigation: any;
};
const LeadDetailsSection: FunctionComponent<props> = ({
  leadData,
  navigation,
  leadId,
}) => {
  return (
    <>
      <View style={styles.detailView}>
        <View style={styles.detailSection}>
          <KeyValue itemKey={'Location'} value={leadData.location} />
          <KeyValue
            itemKey={'Property Stage'}
            value={leadData.property_stage}
          />
          <KeyValue
            itemKey={'Property Sub Type'}
            value={leadData.property_sub_type ? leadData.property_sub_type : ''}
          />
          <KeyValue itemKey={'Project'} value={leadData.project} />
        </View>
        <View
          style={{
            width: 0.8,
            height: '100%',
            backgroundColor: theme.colors.GREY_LIGHT,
            opacity: 0.9,
          }}
        />
        <View style={styles.detailSection}>
        <KeyValue itemKey={'Contact No'} value={leadData.contact_no} />
          <KeyValue itemKey={'Budget'} value={leadData.budget} />
          <KeyValue itemKey={'Property Type'} value={leadData.property_type} />
          <KeyValue itemKey={'Lead Source'} value={leadData.lead_source} />
        </View>
      </View>
      {!inActiveStages.includes(leadData.stage) && !leadData.transfer_status && (
        <View style={styles.buttonParent}>
          {(leadData.stage === 'FRESH' || leadData.stage === 'CALLBACK') && (
            <>
              <CustomButton
                title={'Interested'}
                color={theme.colors.GREEN}
                onPress={() =>
                  navigation.navigate('Interested', {leadData, leadId})
                }
                width={widthToDp(22)}
                size={widthToDp(3.5)}
              />
              <CustomButton
                title={
                  leadData.stage === 'FRESH' ? 'Call Back' : 'Re-Call Back'
                }
                color={theme.colors.BLUE}
                onPress={() =>
                  navigation.navigate('CallBack', {leadData, leadId})
                }
                width={
                  leadData.stage === 'FRESH' ? widthToDp(22) : widthToDp(25)
                }
                size={widthToDp(3.5)}
              />
              <CustomButton
                title={'Not Interested'}
                color={theme.colors.RED}
                onPress={() =>
                  navigation.navigate('NotInterested', {leadData, leadId})
                }
                width={widthToDp(29)}
                size={widthToDp(3.5)}
              />
            </>
          )}

          {leadData.stage === 'INTERESTED' && (
            <>
              <CustomButton
                title={'Create'}
                color={theme.colors.GREEN}
                onPress={() =>
                  navigation.navigate('CreateTask', {leadData, leadId})
                }
                width={widthToDp(18)}
                size={widthToDp(3.5)}
              />
              <CustomButton
                title={'Re Schedule'}
                color={theme.colors.GREEN}
                onPress={() =>
                  navigation.navigate('ReScheduleTask', {leadData, leadId})
                }
                width={widthToDp(24)}
                size={widthToDp(3.5)}
              />
              <CustomButton
                title={'Won'}
                color={theme.colors.BLUE}
                onPress={() => navigation.navigate('Won', {leadData, leadId})}
                width={widthToDp(15)}
                size={widthToDp(3.5)}
              />
              <CustomButton
                title={'Lost'}
                color={theme.colors.RED}
                onPress={() => navigation.navigate('Lost', {leadData, leadId})}
                width={widthToDp(15)}
                size={widthToDp(3.5)}
              />
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  detailView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingBottom: 10,
  },
  detailSection: {
    width: '45%',
    paddingHorizontal: '1%',
  },
  buttonParent: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default LeadDetailsSection;
