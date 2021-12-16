import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from '../screens/HomeScreen';
import {register} from 'react-native-bundle-splitter';
import Tools from '../screens/Tools';

const KnowledgeCenter = register({
  loader: () => import('../screens/KnowledgeCenter'),
});

const Tab = createMaterialBottomTabNavigator();

const HomeBottomRoute = () => {
  return (
    <Tab.Navigator
      activeColor={theme.nav_colors.PRIMARY}
      inactiveColor={theme.nav_colors.INACTIVE}
      sceneAnimationEnabled={false}
      barStyle={{backgroundColor: '#fff', paddingRight: '2%'}}
      initialRouteName={'HomeScreen'}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarColor: '#fff',
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={Tools}
        options={{
          tabBarColor: '#fff',
          tabBarLabel: 'Tools',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'hammer' : 'hammer-outline'}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="KnowledgeCenter"
        component={KnowledgeCenter}
        options={{
          tabBarColor: '#fff',
          tabBarLabel: 'Knowledge Center',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'book' : 'book-outline'}
              color={color}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeBottomRoute;
