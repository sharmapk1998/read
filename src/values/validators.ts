import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';

export const emailValidate = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(email).toLowerCase());
  if (valid) {
    return '';
  } else {
    return 'Invalid Email';
  }
};

export const passwordValidate = (password: string) => {
  if (password.length >= 8) {
    return '';
  } else {
    return 'Minimum 8 char password required';
  }
};

export const validateInterested = (
  firstName: string,
  lastName: string,
  propertyType: string,
  propertySubType: string,
  propertyStage: string,
  location: string,
  project: string,
  budget: string,
  followUp: string,
  date: Date,
  orgConstants: any,
) => {
  let error = '';
  if (firstName.length == 0) {
    error = 'First Name is required!';
  } else if (lastName.length == 0) {
    error = 'Last Name is required!';
  } else if (propertyType === 'select') {
    error = 'Property Type is required!';
  } else if (
    propertyType === 'Residential' &&
    orgConstants.resTypes.length !== 0 &&
    propertySubType === 'select'
  ) {
    error = 'Property Sub Type is required!';
  } else if (
    propertyType === 'Commercial' &&
    orgConstants.comTypes.length !== 0 &&
    propertySubType === 'select'
  ) {
    error = 'Property Sub Type is required!';
  } else if (propertyStage === 'select') {
    error = 'Property Stage is required!';
  } else if (location === 'select') {
    error = 'Location is required!';
  } else if (project === 'select') {
    error = 'Project is required!';
  } else if (budget === 'select') {
    error = 'Budget is required!';
  } else if (followUp === 'select') {
    error = 'Follow Up is required!';
  } else if (date < new Date()) {
    error = 'Task Cannot be Schedule For Old Date & Time!';
  }
  if (error == '') {
    return {
      budget: budget,
      customer_name: firstName + ' ' + lastName,
      location: location,
      project: project,
      property_stage: propertyStage,
      property_type: propertyType,
      property_sub_type: propertySubType === 'select' ? '' : propertySubType,
      stage: 'INTERESTED',
      next_follow_up_type: followUp,
      next_follow_up_date_time: date,
      modified_at: firestore.Timestamp.now(),
      stage_change_at: firestore.Timestamp.now(),
    };
  } else {
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    return undefined;
  }
};

export const validateEdit = (
  firstName: string,
  lastName: string,
  propertyType: string,
  propertyStage: string,
  location: string,
  project: string,
  budget: string,
  altPhone: string | undefined,
  contact_no: string | undefined,
) => {
  let error = '';
  if (firstName.length == 0) {
    error = 'First Name is required!';
  } else if (lastName.length == 0) {
    error = 'Last Name is required!';
  } else if (propertyType === 'select') {
    error = 'Property Type is required!';
  } else if (propertyStage === 'select') {
    error = 'Property Stage is required!';
  } else if (location === 'select') {
    error = 'Location is required!';
  } else if (project === 'select') {
    error = 'Project is required!';
  } else if (budget === 'select') {
    error = 'Budget is required!';
  } else if (contact_no && contact_no === '') {
    error = 'Contact No. is required!';
  }

  if (error == '') {
    let data: any = {
      budget: budget,
      customer_name: firstName + ' ' + lastName,
      location: location,
      project: project,
      property_stage: propertyStage,
      property_type: propertyType,
    };
    if (contact_no) {
      data['contact_no'] = contact_no;
    }
    if (altPhone) {
      data['alternate_no'] = altPhone;
    }
    return data;
  } else {
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    return undefined;
  }
};
