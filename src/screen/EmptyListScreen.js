import { StyleSheet, Text, View } from "react-native"
import { PRIMARY } from "../colors";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";


const EmptyListScreen = () => {
    const { user } = useContext(UserContext);
    console.log(user);
    return (<View style = {styles.container}>
            <Text style={styles.text}>아직 등록된 매칭이 없습니다.{'\n'} 매칭을 등록해보세요!</Text>
        </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        color: PRIMARY.DARK,
        fontSize: 20,
        fontWeight: '700',
    },
});

export default EmptyListScreen;