import { Button, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Input, { KeyboardTypes, ReturnKeyTypes } from "../components/Input";

const SignInScreen = () => {
  return (
    <KeyboardAvoidingView
    style={{flex: 1}}
    behavior={Platform.select({ ios: 'padding'})}>
      <View style={styles.container}>
        <Input title={'아이디'} placeholder={'아이디 입력'} returnKeyType={ReturnKeyTypes.NEXT}/>
        <Input title={'비밀번호'} returnKeyType={ReturnKeyTypes.DONE} secureTextEntry={true}/>
        <Button title={"로그인"} />
      </View>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default SignInScreen;