import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "../screen/ListScreen";
import { WHITE } from "../colors";


const Stack = createNativeStackNavigator();
const MainStack = () => {
    return (<Stack.Navigator
    screenOptions={
        {
            contentStyle: {backgroundColor: WHITE},
            headerShown: true,
        }
    }>
        <Stack.Screen name="ListScreen" component={ListScreen}/>
    </Stack.Navigator>);
};

export default MainStack;