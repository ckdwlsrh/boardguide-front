import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screen/SignInScrean";
import SignUpScreen from "../screen/SignUpScreen";
import PreferGenre from "../screen/PreferGenre";
import SetLocation from "../screen/SetLocation";
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
            <Stack.Screen name="SignUp">
                {(screenProps) => <SignUpScreen {...screenProps} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="SetLocation" component={SetLocation}/>
            <Stack.Screen name="PreferGenre" component={PreferGenre}/>

        </Stack.Navigator>
    );
};

export default AuthStack;