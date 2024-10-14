import { Keyboard, StyleSheet, View } from "react-native";
import SafeInputView from "../components/SafeInputView";
import Input, { InputStyles, InputTypes, ReturnKeyTypes } from "../components/Input";
import { useEffect, useRef, useState } from "react";
import { signup } from "../service/Apiservice";
import Button from "../components/Button";

const SignUpScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [email, setEmail] = useState('');
  const emailRef = useRef(null);
  const [nickname, setNickname] = useState('');
  const nicknameRef = useRef(null);
  const [passwordCheck, setPasswordCheck] = useState('');
  const passwordCheckRef = useRef(null);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!(userId && password && nickname && passwordCheck && (password === passwordCheck) && email));
  }, [userId, password, nickname, passwordCheck, email]);

  const onSubmit = () => {
    Keyboard.dismiss();
    navigation.navigate("SetLocation", { userId: userId, password: password, nickname: nickname, email: email,} );
  }

  return (
    <SafeInputView>
      <View style={styles.container}>
          <Input inputType={InputTypes.USERID} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.NEXT}
                 value={userId}
                 onSubmitEditing={() => nicknameRef.current.focus()}
                 onChangeText={(userId) => {setUserId(userId.trim())}} />
          
          <Input inputType={InputTypes.NICKNAME} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.NEXT}
                value={nickname}
                ref={nicknameRef}
                onSubmitEditing={() => passwordRef.current.focus()}
                onChangeText={(nickname) => {setNickname(nickname.trim())}} />
          
          <Input inputType={InputTypes.NEWPASSWORD} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.NEXT}
                 value={password}
                 onSubmitEditing={() => passwordCheckRef.current.focus()}
                 ref={passwordRef}
                 onChangeText={(password) => {setPassword(password.trim())}} />

          <Input inputType={InputTypes.PASSWORDCHECK} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.NEXT}
                 value={passwordCheck}
                 onSubmitEditing={() => emailRef.current.focus()}
                 ref={passwordCheckRef}
                 onChangeText={(passwordCheck) => {setPasswordCheck(passwordCheck.trim())}} />

          <Input inputType={InputTypes.EMAIL} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.DONE}
                 value={email}
                 onSubmitEditing={onSubmit}
                 ref={emailRef}
                 onChangeText={(email) => {setEmail(email.trim())}} />
          <View style={styles.buttonContainer}>
            <Button title={'회원가입'} onPress={onSubmit} disabled={disabled}/>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
export default SignUpScreen;