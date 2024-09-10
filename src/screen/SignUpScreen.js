import { StyleSheet, View } from "react-native";
import SafeInputView from "../components/SafeInputView";
import Input from "../components/Input";
import { useState } from "react";

const SignUpScreen = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  return (
    <SafeInputView>
      <View style={styles.container}>
      </View>
    </SafeInputView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
export default SignUpScreen;