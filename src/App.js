/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screen/SignInScrean';
import { WHITE } from './colors';
import AuthStack from './navigations/AuthStack';

const App = () => {
  const name = "changjin";
  console.log(name);
  
  return (
    <NavigationContainer>
        <StatusBar style='dark'/>
        <AuthStack />
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