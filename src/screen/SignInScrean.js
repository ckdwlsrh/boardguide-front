/* eslint-disable react/react-in-jsx-scope */
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Input, { InputStyles, InputTypes, ReturnKeyTypes } from "../components/Input";
import Button from "../components/Button";
import { useContext, useEffect, useRef, useState } from "react";
import SafeInputView from "../components/SafeInputView";
import { ACCESS_TOKEN, signin } from "../service/Apiservice";
import * as SecureStore from "expo-secure-store";
import UserContext from "../contexts/UserContext";


const SignInScreen = ({navigation}) => {

  const { setUser } = useContext(UserContext);
  setUser(SecureStore.getItem("userId"));
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const passwordRef = useRef(null);

  useEffect(() => {
    setDisabled(!(userId && password));
  }, [userId, password]);

  const onSubmit = async () => {
    Keyboard.dismiss();
    await signin({userId: userId, password: password});
    const user = SecureStore.getItemAsync("userId");
    setUser(user);
  };
  const toSignUp = () => {
    Keyboard.dismiss();
    navigation.push('SignUp');
  };
  return (
    <SafeInputView>
        <View style={styles.container}>
          <Image source={require('../../assets/board_icon.png')}
                 style={styles.image} />
          <Input inputType={InputTypes.USERID} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.NEXT}
                 value={userId}
                 onSubmitEditing={() => passwordRef.current.focus()}
                 onChangeText={(userId) => {setUserId(userId.trim())}} />
          <Input inputType={InputTypes.PASSWORD} inputStyle={InputStyles.DEFAULT} returnKeyType={ReturnKeyTypes.DONE}
                 value={password}
                 ref={passwordRef}
                 onSubmitEditing={onSubmit}
                 onChangeText={(password) => {setPassword(password.trim())}} />
          <View style={styles.buttonContainer}>
            <Button title={'로그인'} onPress={onSubmit} disabled={disabled}/>
            <Button title={'회원가입'} onPress={toSignUp} disabled={false} /> 
          </View >
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
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
  },
  image: {
    width: 200,
    height: 200,
  },
  signUpContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default SignInScreen;