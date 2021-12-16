import {combineReducers} from 'redux';
import analyticsReducer from './analyticsReducer';
import attachmentReducer from './attachmentsReducer';
import callReducer from './callReducer';
import filtersReducer from './filtersReducer';
import leadCountReducer from './leadCountReducer';
import leadsReducer from './leadsReducer';
import notesReducer from './noteReducer';
import notificationReducer from './notificationReducer';
import projectReducer from './projectReducer';
import refreshReducer from './refresh';
import tasksReducer from './tasksReducer';
import userReducer from './userReducer';
import valuesReducer from './valuesReducer';

const allReducer = combineReducers({
  user: userReducer,
  leads: leadsReducer,
  notes: notesReducer,
  attachments: attachmentReducer,
  tasks: tasksReducer,
  calls: callReducer,
  notification: notificationReducer,
  values: valuesReducer,
  leadCount: leadCountReducer,
  filters: filtersReducer,
  analytics: analyticsReducer,
  projects: projectReducer,
  refresh: refreshReducer,
});

export default allReducer;
