import React from 'react';
import HomeBottomRoute from './HomeBottomRoute';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {enableScreens} from 'react-native-screens';
import {register} from 'react-native-bundle-splitter';
import {connect} from 'react-redux';
import AnalyticsScreens from './AnalyticsScreens';
import OrgAnalyticsScreens from './OrgAnalyticsScreens';
import Compass from '../screens/Compass';
import Converter from '../screens/Converter';
import Report from '../screens/Report';
import Query from '../screens/Query';
import Calculater from '../screens/Calculater';
enableScreens();

const NotesScreen = register({loader: () => import('../screens/NotesScreen')});
const CallBackScreen = register({
  loader: () => import('../screens/CallBackScreen'),
});
const InterstedScreen = register({
  loader: () => import('../screens/InterestedScreen'),
});
const NotIntScreen = register({
  loader: () => import('../screens/NotIntScreen'),
});
const AddContact = register({
  loader: () => import('../screens/AddContact'),
});
const CreateTask = register({
  loader: () => import('../screens/CreateTask'),
});
const ReScheduleTask = register({
  loader: () => import('../screens/ReScheduleTask'),
});
const WonScreen = register({
  loader: () => import('../screens/WonScreen'),
});
const LostScreen = register({
  loader: () => import('../screens/LostScreen'),
});
const CallLogScreen = register({
  loader: () => import('../screens/CallLogScreen'),
});
const AllTaskScreen = register({
  loader: () => import('../screens/AllTasksScreen'),
});
const AllAttachmentsScreen = register({
  loader: () => import('../screens/AllAttachmentsScreen'),
});
const GroupedLeadsTopBar = register({
  loader: () => import('./GroupedLeadsTopBar'),
});
const FAQDetailScreen = register({
  loader: () => import('../screens/FAQDetailScreen'),
});
const Filter = register({
  loader: () => import('../screens/Filter'),
});
const LeadsScreen = register({
  loader: () => import('../screens/LeadsListScreen'),
});
const LeadDetailsScreen = register({
  loader: () => import('../screens/LeadDetailsScreen'),
});

const NotificationScreen = register({
  loader: () => import('../screens/NotificationScreen'),
});

const FAQScreen = register({
  loader: () => import('../screens/FAQScreen'),
});

const LibraryScreen = register({
  loader: () => import('../screens/LibraryScreen'),
});

const DeveloperScreen = register({
  loader: () => import('../screens/DeveloperScreen'),
});

const ProjectDetailsScreen = register({
  loader: () => import('../screens/ProjectDetailsScreen'),
});

const DocumentScreen = register({
  loader: () => import('../screens/DocumentScreen'),
});

const NewsScreen = register({
  loader: () => import('../screens/NewsScreen'),
});

const CustomizeLeadView = register({
  loader: () => import('../screens/CustomizeLeadView'),
});

const DrillDown = register({
  loader: () => import('../screens/analytics/DrillDown'),
});

const TaskDrillDown = register({
  loader: () => import('../screens/analytics/TaskDrillDown'),
});

const CallingDrillDown = register({
  loader: () => import('../screens/analytics/CallingDrillDown'),
});

const Stack = createNativeStackNavigator();
function HomeScreens({user}: any) {
  return (
    <Stack.Navigator initialRouteName={'HomeBottomRoute'}>
      <Stack.Screen
        name="HomeBottomRoute"
        component={HomeBottomRoute}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Query"
        component={Query}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Leads"
        component={LeadsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LeadDeatils"
        component={LeadDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CallBack"
        component={CallBackScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Interested"
        component={InterstedScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotInterested"
        component={NotIntScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContact}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Analytics"
        component={
          user.role === 'Lead Manager' || user.role === 'Team Lead'
            ? OrgAnalyticsScreens
            : AnalyticsScreens
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTask}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReScheduleTask"
        component={ReScheduleTask}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Won"
        component={WonScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Lost"
        component={LostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CallLogs"
        component={CallLogScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllTasks"
        component={AllTaskScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Grouped Leads"
        component={GroupedLeadsTopBar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllAttachments"
        component={AllAttachmentsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FAQDetail"
        component={FAQDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FAQScreen"
        component={FAQScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LibraryScreen"
        component={LibraryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DeveloperScreen"
        component={DeveloperScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProjectDetailsScreen"
        component={ProjectDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DocumentScreen"
        component={DocumentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CustomizeLeadView"
        component={CustomizeLeadView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Compass"
        component={Compass}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Converter"
        component={Converter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Calculater"
        component={Calculater}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrillDown"
        component={DrillDown}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TaskDrillDown"
        component={TaskDrillDown}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CallingDrillDown"
        component={CallingDrillDown}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(HomeScreens);
