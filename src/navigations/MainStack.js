import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "../screen/ListScreen";
import { BLACK, GRAY, PRIMARY, WHITE } from "../colors";
import PostScreen from "../screen/PostScreen";
import ProfileScreen from "../screen/ProfileScreen";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PostSubmitScreen from "../screen/PostSubmitScreen";
import PostDetailSubmitScreen from "../screen/PostDetailSubmitScreen";


const Stack = createNativeStackNavigator();
const MainStack = () => {
    const navigation = useNavigation();
    return (<Stack.Navigator
    screenOptions={
        {
            contentStyle: {backgroundColor: WHITE},
            headerShown: true,
        }
    }>
        <Stack.Screen name="ListScreen" options={{ 
            title: '보드커넥트',
            headerStyle: {
                backgroundColor: PRIMARY.DEFAULT,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize: 20,
            },
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                        <MaterialCommunityIcons name="cog" size={28} color={GRAY} />
                </Pressable>
            ),
         }} component={ListScreen}/>
         <Stack.Screen name="PostScreen" 
         component={PostScreen} options={{
            headerShown: false,
         }}/>
         <Stack.Screen name="PostSubmitScreen" options={{
            headerShown: false,
         }}
         component={PostSubmitScreen} />
         <Stack.Screen name="PostDetailSubmitScreen" options={{
            headerShown: false,
         }}
         component={PostDetailSubmitScreen} />
         <Stack.Screen name="ProfileScreen" 
         options={{
            title: '내 프로필',
            headerStyle: {
                backgroundColor: PRIMARY.LIGHT,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize: 20,
            },
         }}
         component={ProfileScreen} />

         
    </Stack.Navigator>);
};

export default MainStack;