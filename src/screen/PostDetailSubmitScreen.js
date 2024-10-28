import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import InputFAB from "../components/InputFAB";
import { useContext, useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { call } from "../service/Apiservice";
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import UserContext from "../contexts/UserContext";

const PostDetailSubmitScreen = ({navigation, route}) => {
    const { selectedItem } = route.params;
    const { user } = useContext(UserContext);
    // 입력받을 데이터 상태 관리
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState(null);
    const [profile, setProfile] = useState(null);
    const [location, setLocation] = useState({
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);


    useEffect(()=> {
        call("/api/profile","POST",{userId: user}).then((response) => {
            setProfile(response);
            setLocation({
                latitude: Number(response.latitude), 
                longitude: Number(response.longitude),
                latitudeDelta: 0.001,
                longitudeDelta: 0.001});
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const getAddressFromCoordinates = async (latitude, longitude) => {
            try {
              // expo-location의 geocodeAsync 사용하여 주소 얻기
              let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      
              if (geocode.length > 0) {
                const { street, city, region, postalCode } = geocode[0];
                const fullAddress = `${region} ${city} ${street}`;
                setAddress(fullAddress); // 주소 상태 업데이트
              } else {
                setAddress("주소를 찾을 수 없습니다.");
              }
            } catch (error) {
              console.log("Error in reverse geocoding:", error);
              setAddress("오류가 발생했습니다.");
            }
          };
          // 현재 좌표로 주소를 가져옴
          if (location && location.latitude && location.longitude) {
            getAddressFromCoordinates(location.latitude, location.longitude);
          }
    },[location]);
    // 날짜 선택 핸들러
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowDatePicker(false);
        setEndDate(currentDate);
    };

    const onSubmit = () => {
        console.log("제목:", title);
        console.log("위치:", location);
        console.log(selectedItem);
        console.log("마감 날짜:", endDate.toDateString());

        call("/api/posting","POST", {
            title: title, 
            boardgame: selectedItem.boardGame, 
            userId: user, 
            nickname: profile.nickname, 
            userNum: 1, 
            users: [user,], 
            limitUser: selectedItem.playerMax, 
            limitDate: endDate.toDateString(), 
            latitude: location.latitude,
            longitude: location.longitude,
            address: address
        }).then((response) => {
            if (response) {
              Alert.alert("보드게임 매칭 글이 등록되었습니다.");
              navigation.popToTop();
            }
          });

    }
    return (<View style={styles.container}>
            <Text style={styles.mainTitle}>매칭 세부 사항을 정해주세요.</Text>
        <ScrollView>
            <Text style={styles.label}>제목</Text>
            <TextInput
                style={styles.input}
                placeholder="매칭글의 제목을 입력해 주세요."
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>모집할 위치</Text>
            {isLoading ? <Text>loading..</Text> : (<MapView
                style={styles.map}
                initialRegion={location}
                onRegionChangeComplete={(region) => setLocation(region)}
            >
                <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
                />
            </MapView>)}

            <Text style={styles.label}>모집 마감 날짜</Text>
            <DateTimePicker
                style={{padding: 20, marginBottom: 20}}
                value={endDate}
                mode="date"
                display="inline"
                onChange={onDateChange}
                minimumDate={new Date()}
            /> 

       
        </ScrollView>
        <InputFAB icon={'check'} onPress={onSubmit} disabled={title === ''} />
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    mainTitle: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    dateText: {
        fontSize: 16,
        color: "#555",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    map: {
        width: "100%",
        height: 200,
        marginVertical: 10,
        borderRadius: 8,
    },
});
export default PostDetailSubmitScreen;