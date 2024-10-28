import { useContext, useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View, ScrollView, Pressable, FlatList } from "react-native";
import UserContext from "../contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import { ACCESS_TOKEN, call } from "../service/Apiservice";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../app-config";
import MapView, { Marker } from "react-native-maps";
import { BLACK, GRAY, PRIMARY, WHITE } from "../colors";

const PostItem = ({item, onPress}) => {

    const imageUrl = `${API_BASE_URL}/images/${encodeURIComponent(item.boardgame + '.jpg')}`;
    const today = new Date();
    console.log(item.limitDate);
    const limitdate = new Date(item.limitDate);
    const differenced = Math.ceil((limitdate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    console.log(differenced);
    return (
        <Pressable onPress={() => onPress(item)}
        style= {({pressed}) => [
            styles.card,
            {backgroundColor : pressed ? '#dddddd' : WHITE},
        ]}>
            <Image source={{ uri: imageUrl }} style={styles.image} /> 
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {(differenced < 0) ? <Text style={{color: '#ddd'}}>마감</Text> : <Text style={{color: '#ff0000'}}>D - {differenced}</Text>}
            </View>
        </Pressable>
    );
}
const ProfileScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [loadingMap, setLoadingMap] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingProfileImage, setLoadingProfileImage] = useState(true);
    const [profile, setProfile] = useState([]);

    const toPostScreen = (item) => {
        navigation.navigate('PostScreen', { item: item } );
    }
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      
      // 랜덤 크기 생성 함수
      const getRandomSize = () => {
        return Math.floor(Math.random() * 10) + 20; // 20에서 30 사이의 크기
      };
      
      const CategoryItem = ({ item }) => {
        const backgroundColor = getRandomColor();
        const fontSize = getRandomSize();
      
        return (
          <View style={[styles.categoryBox, { backgroundColor }]}>
            <Text style={[styles.categoryText, { fontSize }]}>{item}</Text>
          </View>
        );
      };

    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status !== 'granted') {
            alert("이미지에 대한 권한이 허락되지 않았습니다.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync( {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log(profile.nickname);
            let formData = new FormData();

            formData.append("image",{
                uri: result.assets[0].uri,
                name: profile.nickname + ".jpg",
                type: "image/jpeg",
            });

            console.log(result.assets[0].uri);
            setProfileImage(result.assets[0].uri);

            call("/images/upload","POST",formData, true);
        }
    };

    const Logout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("logout cancelled"),
                    style: "cancel"
                },
                {
                    text: "로그아웃",
                    onPress: () => {
                        Alert.alert("로그아웃 완료되었습니다.");
                        setUser(null);
                        SecureStore.deleteItemAsync("userId");
                        SecureStore.deleteItemAsync(ACCESS_TOKEN);
                    },
                    style: "destructive"
                }
            ],
            {cancelable: false}
        );
    }

    useEffect(() => {
        call("/api/profile","POST",{userId : user}).then((response) => {
            console.log(response);
            setProfile(response);
            setProfileImage(`${API_BASE_URL}/images/${encodeURIComponent(response.nickname + '.jpg')}`);
            console.log(profileImage);
            setLoadingMap(false);
        });

        call("/api/myposts","POST",{ userId: user }).then((response) => {
            setMyPosts(response);
            setLoadingPosts(false);
            console.log(myPosts);
        });
    },[]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            {/* 프로필 이미지 */}
            <Pressable onPress={pickImage}>
                <Image 
                    source={{ uri: profileImage }} // 임시 이미지 URL, 실제 사용자의 이미지로 교체 가능
                    style={styles.profileImage}
                />
            </Pressable>
            {/* 프로필 정보 */}
            <Text style={styles.name}>{profile.nickname} 님</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.itemBox}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>선호하는 장르</Text>
                <FlatList
                    data={profile.favoriteGenre}
                    renderItem={({ item }) => <CategoryItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2} // 그리드 형태로 두 개의 열로 배치
                    scrollEnabled={false}
                />
            </View>
            <View style={styles.itemBox}>
                <Text style={styles.addressTitle}>우리 지역</Text>
                <Text style={styles.address}>{profile.address}</Text>
                <View style={styles.mapContainer}>
                    {loadingMap ? <Text> 로딩 중 ...</Text> : <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: profile.latitude,
                            longitude: profile.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001,
                        }}
                        scrollEnabled={false}
                        pitchEnabled={false}
                        >
                            <Marker
                            coordinate={{latitude: profile.latitude, longitude: profile.longitude}}
                            title={profile.nickname}
                            description="지정한 주소입니다." />
                        </MapView>
                    }
                </View>
            </View>
            <View style={styles.itemBox}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>참가한 보드게임 매칭</Text>
                <FlatList
                    data={myPosts}
                    renderItem={({ item }) => <PostItem item={item} onPress={toPostScreen} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
            </View>
            {/* 로그아웃 버튼 */}
            <Button title="로그아웃" onPress={Logout} color="#ff5c5c" />
        </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mapContainer: {
        height: 200,
        width: 300,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 8,
    }
    ,
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    address: {
        fontSize: 15,
        color: '#666',
        marginBottom: 4,
    },
    addressTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        borderRadius: 90,
        width: 30,
        height: 30,
        marginRight: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    itemBox: {
        width: 330,
        borderColor: '#d3d3d3',
        padding: 15,
        borderWidth: 1,
        borderRadius: 7,
        height: 'auto',
        marginBottom: 15,
    },
    categoryBox: {
        flex: 1,
        margin: 10,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // 그림자 효과 (Android)
        shadowColor: '#000', // 그림자 효과 (iOS)
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    categoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        flexDirection: "row", // 이미지와 텍스트를 가로로 배치
        backgroundColor: "#ffffff", // 카드 배경색
        borderRadius: 10, // 둥근 모서리
        padding: 10, // 내부 여백
        marginVertical: 8, // 카드 사이 간격
        marginHorizontal: 16, // 좌우 여백
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Android 그림자
    },
    textContainer: {
        flex: 1,
        justifyContent: "center", // 텍스트를 세로로 가운데 정렬
    },
});


export default ProfileScreen;