import React, {FunctionComponent, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../Components/Header';
import InputWithLogo from '../Components/InputWithLogo';
import Loader from '../Components/Modals/Loader';
import SubmitButton from '../Components/SubmitButton';
import {
  createLeadFirebase,
  editLeadFirebase,
  updateLeadCountState,
} from '../Services/leads';
import theme from '../values/theme';
import {emailValidate} from '../values/validators';
const {height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import Snackbar from 'react-native-snackbar';
import {editDataTemplate} from '../values/dataTemplate';
import CustomPicker from '../Components/CustomPicker';
import {sendLeadNotification} from '../Services/notification';
import countryData from '../values/countries';
import { DataTable } from 'react-native-paper';

type props = {
  navigation: any;
  route: any;
  user: any;
  orgConstants: any;
};

const AddContact: FunctionComponent<props> = ({
  navigation,
  route,
  user,
  orgConstants,
}) => {
  const data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country_code: string;
  } = route.params?.data
    ? route.params.data
    : {name: '', lastName: '', phone: '', email: ''};
  const altPhoneRoute = route.params?.data.altPhone
    ? route.params?.data?.altPhone
    : '';
  const leadId = route.params?.leadId;
  const edit = route.params?.edit;
  const lastNameRef: any = useRef();
  const phoneRef: any = useRef();
  const altPhoneRef: any = useRef();
  const emailRef: any = useRef();
  const [load, setLoad] = useState(false);
  const [firstName, setFirstName] = useState<string>(data.firstName);
  const [lastName, setLastName] = useState<string>(data.lastName);
  const [phone, setPhone] = useState<string>(data.phone);
  const [altPhone, setAltPhone] = useState<string>(altPhoneRoute);
  const [owner, setOwner] = useState('select');
  const [source, setSource] = useState('select');
  const [orgUsers, setOrgUsers] = useState<string[]>([]);
  const [email, setEmail] = useState<string>(data.email ? data.email : '');
  const [countryLabels, setCountryLabels] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState<string>('');
  const dispatcher = useDispatch();

useEffect(() =>{
  // console.log(data.country_code)
  
if(data.country_code && data.country_code !== ''){
  let code = countryData.filter(country=>country.dial_code===data.country_code)
  // console.log(code)
  if(code.length !== 0){
    setCountryCode(code[0].flag + ' ' + code[0].dial_code + ' ' + code[0].name);
  }
  else{
    let code = countryData.filter(country=>country.dial_code==='+91')
    setCountryCode(code[0].flag + ' ' + code[0].dial_code + ' ' + code[0].name);
  }
}
else{
  let code = countryData.filter(country=>country.dial_code==='+91')
  setCountryCode(code[0].flag + ' ' + code[0].dial_code + ' ' + code[0].name);
}
},[data.country_code])
  useEffect(() => {
    if (user.role === 'Lead Manager') {
      if (user.organization_users) {
        const orgUsersList: string[] = [];
        user.organization_users.forEach((item: any) => {
          if (item.uid !== user.uid && item.status === 'ACTIVE') {
            orgUsersList.push(item.user_name + ` (${item.user_email})`);
          }
        });
        
        setOrgUsers(orgUsersList);
      }
    } else if (user.role === 'Team Lead') {
      if (user.organization_users) {
        const orgUsersList: string[] = [];
        user.usersList.forEach((uid: any) => {
          const selectedUser = user.organization_users.filter(
            (item: any) =>
              item.uid === uid && user.uid !== uid && item.status === 'ACTIVE',
          );
          if (selectedUser.length > 0) {
            orgUsersList.push(
              selectedUser[0].user_name + ` (${selectedUser[0].user_email})`,
            );
          }
        });
        setOrgUsers(orgUsersList);
      }
    }
  }, [user.role]);

  useEffect(() => {
    let labels: string[] = [];
    countryData.forEach((data) => {
      labels.push(data.flag + ' ' + data.dial_code + ' ' + data.name);
    });
    setCountryLabels(labels);
  }, []);

  useEffect(() => {
    let selected: string[] = [];
    // console.log(selected[1])
    // if(edit === true){
    //   selected =user.country
    // }
    if (user.country && data.country_code===undefined || data.country_code==='') {
      selected = countryLabels.filter((item) =>
        item.toLowerCase().includes(user.country.toLowerCase()),
      );
    } 
    // else if(data.country_code===undefined || data.country_code===''){
    //   selected = countryLabels.filter((item) =>
    //     item.toLowerCase().includes('+91'),
    //   );
    // }
    if (selected.length !== 0) {
      setCountryCode(selected[0]);
    }
  }, [user.country, countryLabels]);


  const onSubmit = () => {
    if (firstName === undefined || firstName === '') {
      Snackbar.show({
        text: 'First Name Required!!',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    } else if (lastName === undefined || lastName === '') {
      Snackbar.show({
        text: 'Last Name Required!!',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    } else if (phone === undefined|| phone === '') {
      Snackbar.show({
        text: 'Mobile no. Required!!',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    } else if (email.length !== 0 && emailValidate(email) === 'Invalid Email') {
      Snackbar.show({
        text: 'Invalid Email',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    } else if (countryCode === 'select') {
      Snackbar.show({
        text: 'Please Select Country Code',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    let oldData = data;
    if (edit === true) {
      let data = editDataTemplate(
        firstName,
        lastName,
        email,
        countryCode,
        altPhoneRoute === altPhone ? undefined : altPhone,
        user.organization_id,
        phone === oldData.phone ? undefined : phone,
      );
      editLeadFirebase(
        data,
        (value: boolean) => setLoad(value),
        navigation,
        leadId,
        dispatcher,
      );
      return;
    }
    
    let ownerData: {email: string; uid: string} | undefined = undefined;
    if (owner !== 'select') {
      const split = owner.split(' ');
      const value = split[split.length - 1];
      const ownerEmail = value.slice(1, value.length - 1);
      const selectedUser = user.organization_users.filter(
        (item: any) => item.user_email === ownerEmail,
      );
      if (selectedUser.length !== 0) {
        ownerData = {email: ownerEmail, uid: selectedUser[0].uid};
        sendLeadNotification(user.organization_id, selectedUser[0].uid, '1');
      }
    }
    let code = countryCode.split(' ')[1];
    createLeadFirebase(
      {
        firstName,
        lastName,
        phone,
        email,
        source,
        owner: ownerData,
        organizationID: user.organization_id,
        user,
        country_code: code,
        alternate_no: altPhone,
      },
      (value: boolean) => setLoad(value),
      navigation,
      dispatcher,
      () => updateLeadCountState('NA', 'FRESH', dispatcher),
    );
  };

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Add Contact'} onBack={() => navigation.goBack()}>
        {edit === undefined && (
          <TouchableOpacity style={{marginLeft: 'auto'}} onPress={onSubmit}>
            <Icon name={'check'} color={'#fff'} size={27} />
          </TouchableOpacity>
        )}
      </Header>
      <ScrollView
        style={styles.parent}
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={styles.inputView}>
          <Text style={styles.headStyle}>
            FIRST NAME <Text style={{color: theme.colors.RED}}>*</Text>
          </Text>
          <InputWithLogo
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'First Name',
              value: firstName,
              onChangeText: (value: string) => setFirstName(value),
              returnKeyType: 'next',
              onSubmitEditing: () => lastNameRef.current?.focus(),
            }}
            logo={'person'}
            shadow={false}
            fontSize={13}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.headStyle}>
            LAST NAME <Text style={{color: theme.colors.RED}}>*</Text>
          </Text>
          <InputWithLogo
            ref={lastNameRef}
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'Last Name',
              value: lastName,
              onChangeText: (value: string) => setLastName(value),
              returnKeyType: 'next',
              onSubmitEditing: () => phoneRef.current?.focus(),
            }}
            fontSize={13}
            logo={'person'}
            shadow={false}
          />
        </View>
        {(edit === undefined ||
          (user.role === 'Lead Manager' && edit === true)) && (
          <>
            <CustomPicker
              title={'Country Code'}
              selected={countryCode}
              // onChange={(value: any) => setCountryCode(value)}
              setSelected={(value: any) => setCountryCode(value)}
              data={countryLabels}
              titleStyle={styles.headStyle}
              style={styles.inputView}
              search={true}
            />

            <View style={styles.inputView}>
              <Text style={styles.headStyle}>
                Mobile No <Text style={{color: theme.colors.RED}}>*</Text>
              </Text>
              <InputWithLogo
                ref={phoneRef}
                style={styles.inputBoxStyle}
                inputProps={{
                  placeholder: 'Mobile No',
                  value: phone,
                  onChangeText: (value: string) => setPhone(value),
                  keyboardType: 'number-pad',
                  returnKeyType: 'next',
                  onSubmitEditing: () => altPhoneRef.current?.focus(),
                }}
                fontSize={13}
                logo={'call'}
                shadow={false}
              />
              <Text style={styles.headStyle}>
              <Text style={{color: theme.colors.RED}}>*</Text> Country Code Not Required
              </Text>
            </View>
          </>
        )}

        <View style={styles.inputView}>
          <Text style={styles.headStyle}>Alternate Mobile No</Text>
          <InputWithLogo
            ref={altPhoneRef}
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'Alternate Mobile No',
              value: altPhone,
              onChangeText: (value: string) => setAltPhone(value),
              keyboardType: 'number-pad',
              returnKeyType: 'next',
              onSubmitEditing: () => emailRef.current?.focus(),
            }}
            fontSize={13}
            logo={'call'}
            shadow={false}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.headStyle}>
            Email ID <Text style={{color: theme.colors.RED}}></Text>
          </Text>
          <InputWithLogo
            ref={emailRef}
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'Email',
              value: email,
              onChangeText: (value: string) => setEmail(value),
              returnKeyType: 'done',
            }}
            fontSize={13}
            logo={'mail'}
            shadow={false}
            validator={emailValidate}
          />
        </View>
        {edit === undefined &&
          (user.role === 'Lead Manager' || user.role === 'Team Lead') && (
            <>
              <CustomPicker
                notMandatory
                title={'Owner'}
                selected={owner}
                setSelected={(value: any) => setOwner(value)}
                data={orgUsers}
                titleStyle={styles.headStyle}
                style={styles.inputView}
                search={true}
              />
              
            </>
          )}
        {edit === undefined &&
          (user.role === 'Lead Manager') && (
            <>
              <CustomPicker
                notMandatory
                title={'Lead Source'}
                selected={source}
                setSelected={(value: any) => setSource(value)}
                data={orgConstants.sources}
                titleStyle={styles.headStyle}
                style={styles.inputView}
                search={true}
              />
              
            </>
          )}

        {edit && (
          <SubmitButton
            title={'Update'}
            style={{marginTop: 50}}
            onPress={onSubmit}
          />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: height,
    width: '100%',
    paddingHorizontal: '6%',
    backgroundColor: '#fff',
    paddingBottom: '5%',
  },
  headStyle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputView: {
    marginTop: 20,
  },
  inputBoxStyle: {
    marginTop: 13,
    backgroundColor: theme.colors.GREY_BACKGROUND,
    borderRadius: 10,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    orgConstants: state.values?.orgConstants,
  };
};

export default connect(mapStateToProps)(AddContact);
