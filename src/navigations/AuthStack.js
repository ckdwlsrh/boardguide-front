import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screen/SignInScrean";
import SignUpScreen from "../screen/SignUpScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="SingIn">
            <Stack.Screen name="SingIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;