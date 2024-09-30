/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screen/SignInScrean';
import { WHITE } from './colors';
import AuthStack from './navigations/AuthStack';
import { useState } from 'react';
import MainStack from './navigations/MainStack';

const App = () => {
  const name = "changjin";
  console.log(name);
  const [user, setUser] = useState(null);
  
  return (
    <NavigationContainer>
        <StatusBar style='dark'/>
        {user ? (<MainStack user={user} setUser={setUser} />) : (<AuthStack user={user} setUser={setUser} />) }
    </NavigationContainer>
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