import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './screen/SignInScrean';

const App = () => {
  const name = "changjin";
  console.log(name);
  
  return (
    /*<NavigationContainer>
        <SignInScreen />
    </NavigationContainer>*/
    <View style={styles.container}>
        <SignInScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    fontWeight: 700,
    color: 'green',
  },
});

export default App;