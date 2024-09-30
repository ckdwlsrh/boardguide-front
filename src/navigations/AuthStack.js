import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screen/SignInScrean";
import SignUpScreen from "../screen/SignUpScreen";
import { WHITE } from "../colors";

const Stack = createNativeStackNavigator();

const AuthStack = (props) => {
    return (
        <Stack.Navigator initialRouteName="SingIn" screenOptions={{
            contentStyle: {backgroundColor: WHITE},
            headerShown: false,
        }}>
            <Stack.Screen name="SingIn">
                {(screenProps) => <SignInScreen {...screenProps} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;