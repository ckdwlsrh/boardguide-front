import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "../app-config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BLACK, GRAY, PRIMARY, WHITE } from "../colors";
import { useContext, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import UserContext from "../contexts/UserContext";
import { call } from "../service/Apiservice";


const PostScreen = ({ navigation, route}) => {
    const { item: initialItem } = route.params; // 처음에 받은 item을 초기 상태로 설정
    const [item, setItem] = useState(initialItem); // item을 상태로 관리

    const { user } = useContext(UserContext);
    const imageUrl = `${API_BASE_URL}/images/${encodeURIComponent(item.boardgame + '.jpg')}`;
    const userImageUrl = `${API_BASE_URL}/images/${encodeURIComponent(item.nickname + '.jpg')}`;
    const {width, height} = Dimensions.get('window');
    const today = new Date();
    console.log(item.limitDate);
    const limitdate = new Date(item.limitDate);
    const krLimitDate = limitdate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
    });
    const differenced = Math.ceil((limitdate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const [isJoined, setIsJoined] = useState(item.users.includes(user));

    const onbbPress = () => {
        navigation.pop();
    }

    

    const onSubmitPress = () => {
        const updatedUserNum = isJoined ? item.userNum - 1 : item.userNum + 1;
        const updatedUsers = isJoined
            ? item.users.filter(u => u !== user) // 이미 참가한 상태에서 클릭 시 유저를 목록에서 제거
            : [...item.users, user];
        const updatedItem = {...item,
            userNum: updatedUserNum,
            users: updatedUsers,
        };
        setItem(updatedItem);
        console.log(updatedItem);
        call("/api/updatepost","POST",{...updatedItem,});
        setIsJoined(!isJoined);
    }

    const onDeletePress = () => {
        const updatedItem = {...item};
        Alert.alert(
            "삭제하기",
            "정말 삭제 하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("Delete cancelled"),
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: () => {
                        Alert.alert("삭제가 완료되었습니다.");
                        call("/api/deletepost","POST",{...updatedItem,});
                        navigation.pop();
                    },
                    style: "destructive"
                }
            ],
            {cancelable: false}
        )
    }

    return (
        <View style={styles.container}>
    <ScrollView>
        <Image source={{ uri: imageUrl}} style={{width: width, height: height / 3, resizeMode: 'contain', borderBottomWidth: 1, borderColor: GRAY.DEFAULT}} />
        <View style={styles.textContainer}>
            <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                <Text adjustsFontSizeToFit style={styles.title}>{item.title}</Text>
                <View style={styles.profile}>
                    <Image 
                        source={{ uri: userImageUrl }} // 임시 이미지 URL, 실제 사용자의 이미지로 교체 가능
                        style={styles.profileImage}
                    />
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.nickname} 님</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>보드게임</Text><Text style={styles.text2}> {item.boardgame}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>인원모집</Text><Text style={styles.text2}> 현재 {item.userNum} 명 / {item.limitUser} 명</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>모집기간</Text><Text style={styles.text2}> {krLimitDate}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}></Text><Text style={[styles.text2, {color: "#ff0000"}]}> D - {differenced}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>위치</Text><Text style={styles.text2}> {item.address}</Text>
            </View>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
                scrollEnabled={false}
                pitchEnabled={false}
                >
                    <Marker
                    coordinate={{latitude: item.latitude, longitude: item.longitude}}
                    title={item.nickname}
                    description="지정한 주소입니다." />
            </MapView>

            {(item.userId === user) ? (<Pressable onPress={onDeletePress} style={({pressed}) => [styles.button, pressed && {backgroundColor: '#8b0000'}]}>
                        <Text style={styles.buttonText}>삭제하기</Text>
                    </Pressable>) : (<Pressable onPress={onSubmitPress} style={[
                styles.button,
                { backgroundColor: isJoined ? PRIMARY.DEFAULT : PRIMARY.LIGHT }
                 // 상태에 따른 색상
            ]} disabled={(differenced < 0)}>
                <Text style={styles.buttonText}>
                    {isJoined ? "참가완료" : "참가하기"}
                </Text>
            </Pressable>)
            }
        </View>
    </ScrollView>
    <MaterialCommunityIcons style={{position: 'absolute', top: 15, left: 5, padding: 10}} size={28} name="chevron-left" color={PRIMARY.DEFAULT} onPress={onbbPress}/>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        width: 230,
        color: BLACK,
    },
    text: {
        width: '30%',
        fontSize: 16,
        color: BLACK,
        marginBottom: 5,
    },
    text2: {
        width: '70%',
        fontSize: 16,
        color: BLACK,
        marginBottom: 5,
    },
    button: {
        marginVertical: 20,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profile: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffffff", // 카드 배경색
        borderRadius: 10, // 둥근 모서리
        padding: 10, // 내부 여백
        marginVertical: 8, // 카드 사이 간격
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Android 그림자
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
        marginBottom: 20,
    },
    map: {
        height: 200,
        width: 300,
        borderRadius: 8,
    },
});

export default PostScreen;
