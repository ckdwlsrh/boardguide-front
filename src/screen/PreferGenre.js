import { useState , useEffect } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { call, signup } from "../service/Apiservice";
import InputFAB from "../components/InputFAB";
import { API_BASE_URL } from "../app-config";
import { MaterialIcons } from "@expo/vector-icons";

const HorizontalList = ({ items }) => {
    const itemList = items.map((item, index) => ({
        id: index.toString(), // 고유 ID (index를 문자열로 변환)
        title: item,
        imageUrl: `${API_BASE_URL}/images/${encodeURIComponent(item + '.jpg')}`,
      }));
    
    return (
        <FlatList
          data={itemList}
          horizontal
          scrollEnabled={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.horizontalItem}>
              <Text style={styles.subtitle}>{item.title}</Text>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
            </View>
          )}
          // 가로 스크롤바 표시 안함
        />
      );
}

const VerticalList = ({ items , checked, setChecked}) => {

    const toggleCheck = (id) => {
        if ( checked.includes(id)) {
            setChecked(checked.filter((itemId) => itemId !== id));
        }else {
            setChecked([...checked, id]);
        }
        console.log(checked)
    }


    return (
        <FlatList
            data={items}
            keyExtractor={ (item) => item.id }
            renderItem={({item}) => (
              <View style={[styles.verticalItem, checked.includes(item.id) && styles.checked]}>
                  <View style={styles.row}>
                      <Pressable onPress={() => toggleCheck(item.id)}>
                          {checked.includes(item.id) ? (
                              <MaterialIcons name="check-box" size={24} color="green" />
                          ) : (
                              <MaterialIcons name="check-box-outline-blank" size={24} color="gray" />
                          )}
                      </Pressable>
                      <Text style={styles.title}>{item.genre}</Text>
                  </View>
                  <HorizontalList items={item.boardGames} />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
             />
    );
};

const PreferGenre = ({navigation, route }) => {

    const { userId, password, nickname, email, location, address } = route.params;
    const [datas, setDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        call("/api/data/getGenre","GET").then((response) => {
            setDatas(response);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
        });
    }, []);

    onSubmit = () => {
      // 회원가입이 완료되었습니다.
        console.log(checked);
        signup({userId: userId, password: password, nickname: nickname, email: email, latitude: location.latitude, longitude: location.longitude, address: address,favoriteGenre: checked})
        .then((response) => {
          if (response) {
            Alert.alert("회원가입이 완료되었습니다.");
            navigation.popToTop();
          }
        });
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>데이터 로딩중..</Text>
            </View>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <Text style={styles.mainTitle}>알고 있거나 좋아하는{"\n"} 보드게임의 테마를 정해주세요.</Text>
                <VerticalList items={datas} checked={checked} setChecked={setChecked} />
                <InputFAB icon={'check'} onPress={onSubmit} disabled={false} />
            </View>
            );
    };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  verticalItem: {
    heigth: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100, 
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  horizontalItem: {
    width: Dimensions.get('window').width / 3, // 각 아이템의 크기
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    padding: 2,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checked: {
    backgroundColor: 'lightgreen', // 체크된 항목의 배경색
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 20,
    color: 'green',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,  // 구분선의 높이 (두께)
    backgroundColor: '#cccccc',  // 구분선 색상
  },
});

export default PreferGenre;