/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, LogBox } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screen/SignInScrean';
import { WHITE } from './colors';
import AuthStack from './navigations/AuthStack';
import { useState } from 'react';
import MainStack from './navigations/MainStack';
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN } from './service/Apiservice';
import { UserProvider } from './contexts/UserContext';
import Navigation from './navigations/Navigation';

const App = () => {
  LogBox.ignoreAllLogs();
  SecureStore.deleteItemAsync("userId");
  SecureStore.deleteItemAsync(ACCESS_TOKEN);
  const today = new Date();
  if(today.getTime() > parseInt(SecureStore.getItem("exp")) + 86400000) {
    console.log("check");
    SecureStore.deleteItemAsync("userId");
    SecureStore.deleteItemAsync(ACCESS_TOKEN);
  }
  return (
    <UserProvider>
        <StatusBar style='dark'/>
        <Navigation />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  text: {
    fontSize: 30,
    fontWeight: 700,
    color: 'green',
  },
});

export default App;