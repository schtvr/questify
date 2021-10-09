import React, {Profiler} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {Node} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SocialScreen from './screens/SocialScreen';
import TrophyRoomScreen from './screens/TrophyRoomScreen';
import SettingsScreen from './screens/SettingsScreen';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Social" component={SocialScreen} />
        <Tab.Screen name="TrophyRoom" component={TrophyRoomScreen} />
        {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;