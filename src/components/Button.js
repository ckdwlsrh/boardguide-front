import { Pressable, StyleSheet, Text } from "react-native";
import PropTypes from 'prop-types';
import { GRAY, PRIMARY, WHITE } from "../colors";

const Button = ( {title, onPress, disabled} ) => {
    return (
        <Pressable
          onPress={onPress}
          style={({pressed}) => [
            styles.container,
            pressed && {backgroundColor: PRIMARY.DARK},
            disabled && {backgroundColor: GRAY.DEFAULT, opacity: 0.6},
          ]}
          disabled={disabled}
        >
            <Text style={styles.title}>{title}</Text>
        </Pressable>
          
    );
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
    container : {
        borderRadius: 8,
        paddingVertical: 20,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY.DEFAULT,
        width: '40%',
    },
    title: {
        color: WHITE,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default Button;