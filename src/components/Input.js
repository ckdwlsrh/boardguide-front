import { StyleSheet, Text, TextInput, View } from "react-native";
import PropTypes from 'prop-types';

export const ReturnKeyTypes = {
    DONE: 'done',
    NEXT: 'next',
};
export const KeyboardTypes = {
    DEFAULT: 'default',
    EMAIL: 'email-address',
};

const Input = ({title, placeholder, ...props}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TextInput style={styles.input} 
        {...props}
        placeholder={placeholder ?? title} 
        placeholderTextColor={'#a3a3a3'}
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="none" />
    </View>
  );
};

Input.defaultProps = {
    keyboardType: KeyboardTypes.DEFAULT,
    returnKeyType: ReturnKeyTypes.DONE,
    secureTextEntry: false,
};

Input.propTypes = {
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.oneOf(Object.values(KeyboardTypes)),
    returnKeyType: PropTypes.oneOf(Object.values(ReturnKeyTypes)),
    secureTextEntry: PropTypes.bool,
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    title: {
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 42,
    },
});

export default Input;