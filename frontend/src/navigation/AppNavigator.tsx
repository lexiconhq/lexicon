import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '../theme';

import RootStackNavigator from './RootStackNavigator';

export default function AppNavigator() {
  const { colorScheme } = useColorScheme();
  const darkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
        <RootStackNavigator />
      </NavigationContainer>
    </>
  );
}
