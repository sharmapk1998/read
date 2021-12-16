export const leadDataTemplate = (data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  owner: any;
  organizationID: string;
  timeStamp: any;
  user: any;
  country_code: string;
  alternate_no: string;
}) => {
  return {
    alternate_no: data.alternate_no,
    associate_status: true,
    budget: '',
    contact_no: data.phone,
    created_at: data.timeStamp,
    created_by: data.user.user_first_name + ' ' + data.user.user_last_name,
    customer_image: '',
    customer_name:
      data.firstName.charAt(0).toUpperCase() +
      data.firstName.slice(1) +
      ' ' +
      data.lastName.charAt(0).toUpperCase() +
      data.lastName.slice(1),
    email: data.email,
    lead_source: data.source === 'select' ? 'Self Generated' : data.source,
    lead_assign_time: data.timeStamp,
    location: '',
    lost_reason: '',
    not_int_reason: '',
    other_not_int_reason: '',
    other_lost_reason: '',
    previous_owner: '',
    project: '',
    property_stage: '',
    property_type: '',
    source_status: true,
    stage: 'FRESH',
    transfer_status: false,
    uid: data.owner ? data.owner.uid : data.user.uid,
    feedback_time: '',
    next_follow_up_type: '',
    next_follow_up_date_time: '',
    organization_id: data.organizationID,
    contact_owner_email: data.owner ? data.owner.email : data.user.user_email,
    country_code: data.country_code,
  };
};

export const editDataTemplate = (
  firstName: string,
  lastName: string,
  email: string,
  country_code:string,
  alternate_no: string | undefined,
  organizationID: string,
  phone: string | undefined,
) => {
  let data: any = {
    customer_name:
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      ' ' +
      lastName.charAt(0).toUpperCase() +
      lastName.slice(1),
    email: email,
    organization_id: organizationID,
    country_code:country_code.split(" ")[1],
  };
  if (phone) {
    data['contact_no'] = phone;
  }
  if (alternate_no) {
    data['alternate_no'] = alternate_no;
  }
  return data;
};

export const customFieldsData: {[key: string]: string} = {
  'Alternate Number': 'alternate_no',
  Budget: 'budget',
  'Contact No.': 'contact_no',
  'Created At': 'created_at',
  'Created By': 'created_by',
  'Customer Name': 'customer_name',
  Email: 'email',
  Source: 'lead_source',
  'Assign Time': 'lead_assign_time',
  Location: 'location',
  Project: 'project',
  'Property Stage': 'property_stage',
  'Property Type': 'property_type',
  'Follow Up Type': 'next_follow_up_type',
  'Follow Up Date Time': 'next_follow_up_date_time',
  Owner: 'contact_owner_email',
  Campaign: 'campaign',
  Addset: 'addset',
};
