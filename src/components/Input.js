
import { StyleSheet, Text, TextInput, View } from "react-native";
import PropTypes from 'prop-types';
import { BLACK, GRAY, PRIMARY } from "../colors";
import { forwardRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const ReturnKeyTypes = {
    DONE: 'done',
    NEXT: 'next',
};
export const InputTypes = {
    EMAIL: 'EMAIL',
    USERID: 'USERID',
    NICKNAME: 'NICKNAME',
    PASSWORD: 'PASSWORD',
    NEWPASSWORD: 'NEWPASSWORD',
    PASSWORDCHECK: 'PASSWORDCHECK',
    PLAINTEXT: 'PLAINTEXT',
};
export const InputStyles = {
    DEFAULT: 'DEFAULT',
};

export const InputTypeProps ={
    EMAIL: {
        title: 'EMAIL',
        placeholder: 'your@email.com',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        secureTextEntry: false,
        iconName: { active: 'email', inactive: 'email-outline'},
    },
    USERID: {
        title: '아이디',
        placeholder: '아이디를 입력해주세요.',
        keyboardType: 'default',
        textContentType: 'none',
        secureTextEntry: false,
        iconName: { active: 'account', inactive: 'account-outline'},
    },
    NICKNAME: {
        title: '이름 또는 닉네임',
        placeholder: '닉네임를 입력해주세요.',
        keyboardType: 'default',
        textContentType: 'none',
        secureTextEntry: false,
        iconName: { active: 'account', inactive: 'account-outline'},
    },
    PASSWORD: {
        title: '비밀번호',
        placeholder: '비밀번호를 입력해주세요.',
        keyboardType: 'default',
        textContentType: 'none',
        secureTextEntry: true,
        iconName: { acitve: 'lock', inactive: 'lock-outline'},
    },
    NEWPASSWORD: {
        title: '새 비밀번호',
        placeholder: '비밀번호를 입력해주세요.',
        keyboardType: 'default',
        textContentType: 'none',
        secureTextEntry: true,
        iconName: { acitve: 'lock', inactive: 'lock-outline'},
    },
    PASSWORDCHECK: {
        title: '비밀번호 확인',
        placeholder: '앞서 입력한 비밀번호를 한번 더 입력해주세요.',
        keyboardType: 'default',
        textContentType: 'none',
        secureTextEntry: true,
        iconName: { acitve: 'lock', inactive: 'lock-outline'},
    },
};

export const InputStyleProps = {
    DEFAULT: StyleSheet.create({
        container: {
            width: '100%',
            paddingHorizontal: 20,
            marginVertical: 10,
        },
        title: {
            marginBottom: 4,
            color: GRAY.DEFAULT,
        },
        input: {
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingLeft: 30,
            height: 42,
            borderColor: GRAY.DEFAULT,
        },
        focusedInput: {
            borderWidth: 2,
            borderColor: PRIMARY.DEFAULT,
            color: PRIMARY.DEFAULT,
        },
        focusedTitle: {
            fontWeight: '600',
            color: PRIMARY.DEFAULT,
        },
        hasValueTitle: {
            color: BLACK,
        },
        hasValueInput: {
            color: BLACK,
            borderColor: BLACK,
        },
        icon: {
            position: 'absolute',
            left: 28,
            marginTop: 10,
            height: '100%',
            justifyContent: 'center',
        },
    }),
    
};

const Input = forwardRef(({inputType, inputStyle, value, ...props}, ref) => {

  const {
    title,
    placeholder,
    keyboardType,
    secureTextEntry,
    textContentType,
    iconName: {active, inactive},
  } = InputTypeProps[inputType];

  const styles = InputStyleProps[inputStyle];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
        <Text style={[styles.title, value && styles.hasValueTitle, isFocused && styles.focusedTitle]}>{title}</Text>
        <TextInput 
        {...props}
        value={value}
        ref={ref}
        style={[styles.input, value && styles.hasValueInput, isFocused && styles.focusedInput]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none" />
        <View style={styles.icon}>
            <MaterialCommunityIcons
              name={isFocused ? active : inactive}
              size={20}
              color={PRIMARY.DEFAULT} />
        </View>
    </View>
  );
});

Input.displayName = 'Input';


Input.defaultProps = {
    returnKeyType: ReturnKeyTypes.DONE,
};


Input.propTypes = {
    inputType: PropTypes.oneOf(Object.values(InputTypes)).isRequired,
    returnKeyType: PropTypes.oneOf(Object.values(ReturnKeyTypes)),
};


export default Input;