import { Pressable, StyleSheet } from "react-native";
import { PRIMARY, WHITE } from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const InputFAB = ({icon, onPress, disabled}) => {
    return (
        <Pressable 
            onPress={onPress}
            style={({pressed}) => [
                styles.button,
                pressed && {backgroundColor: PRIMARY.DARK},
                disabled && {backgroundColor: GRAY.DEFAULT, opacity: 0.6},
            ]}
        >
            <MaterialCommunityIcons name={icon} size={24} color={WHITE} />
        </Pressable>
    );
}
const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 30,
        right: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY.DEFAULT,
    },
});

export default InputFAB;