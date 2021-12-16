import {setLeadsFilterObject} from '../redux/actions';

export const FilterList: {[key: string]: string} = {
  Location: 'location',
  Project: 'project',
  'Property Stage': 'property_stage',
  'Property Type': 'property_type',
  Source: 'lead_source',
  Owner: 'contact_owner_email',
  'Assign Time': 'lead_assign_time',
};

export const TaskFilterList: {[key: string]: string} = {
  Location: 'location',
  Project: 'project',
  'Property Stage': 'property_stage',
  'Property Type': 'property_type',
  'Call Back Reason': 'call_back_reason',
  'Task Type': 'type',
  Stage: 'stage',
  Owner: 'contact_owner_email',
};
