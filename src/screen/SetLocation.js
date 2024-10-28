import MapView, { Marker } from "react-native-maps"
import InputFAB from "../components/InputFAB";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import { GRAY, PRIMARY } from "../colors";
import { useEffect, useState } from "react";


const SetLocation = ({navigation , route}) => {
    
    const { userId, password, nickname, email } = route.params;    

    const [location, setLocation] = useState({
        latitude: 37.5665, 
        longitude: 126.9780,
      }); // 사용자 위치 상태
    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null); // 에러 메시지 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
  
    useEffect(() => {
      (async () => {
        // 위치 권한 요청
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }
  
        // 현재 위치 가져오기
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001, // 줌 수준 설정
          longitudeDelta: 0.001,
        });
        setLoading(false);
      })();
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
          getAddressFromCoordinates(location.latitude, location.longitude);
    },[location]);
  
    const handleRegionChangeComplete = (region) => {
        setLocation({
            latitude: region.latitude,
            longitude: region.longitude,
        })
    }

    const onSubmit = () => {
      console.log(userId);
        navigation.navigate("PreferGenre", {userId: userId, password: password, nickname: nickname, email: email, location: location, address: address,});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>매칭 가능 지역을 설정해주세요.</Text>
            <Text style={styles.headerAddress}>{address}</Text>
            <View style={styles.mapContainer} >
                {loading ? <Text>로딩 중...</Text> : <MapView
                        style={styles.map}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChangeComplete={handleRegionChangeComplete}
                    >
                        {location && (
                            <Marker
                                coordinate={location}
                                title="현위치"
                                description="현재 위치입니다."
                            />
                        )}
                    </MapView>
                }
            </View>
            <InputFAB icon={'arrow-right'} onPress={onSubmit} disabled={false} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    mapContainer: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 10,
    },
    map: {
        borderRadius: 20,
        width: '100%',
        height: Dimensions.get('window').height * 2 / 3,
    },
    headerText: {
        marginTop: 50,
        textAlign: 'center', 
        fontSize: 24,
        fontWeight: 'bold',
        color: GRAY,
    },
    headerAddress: {
        marginTop: 30,
        marginHorizontal: 30,
        padding: 10,
        textAlign: 'center', 
        fontSize: 20,
        fontWeight: 'bold',
        color: GRAY,
        borderColor: '#f4511e',
        borderWidth: 2,
        borderRadius: 8,
    }
});

export default SetLocation;
