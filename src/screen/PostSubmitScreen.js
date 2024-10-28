import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import InputFAB from "../components/InputFAB";
import { memo, useEffect, useState } from "react";
import { call } from "../service/Apiservice";
import Input, { InputStyles, InputTypes, ReturnKeyTypes } from "../components/Input";
import { API_BASE_URL } from "../app-config";
import { WHITE } from "../colors";

const ListItem = memo(({item, onPress, isSelected}) => {

    const imageUrl = `${API_BASE_URL}/images/${encodeURIComponent(item.boardGame + '.jpg')}`;
    return (
        <Pressable onPress={() => onPress(item)}
        style= {({pressed}) => [
            styles.card,
            {backgroundColor : isSelected ? '#87CEFA' : pressed ? '#dddddd' : WHITE},
        ]}>
            <Image source={{ uri: imageUrl }} style={styles.image} /> 
            <View style={styles.textContainer}>
                <Text style={styles.boardgame}>{item.boardGame}</Text>
                <Text style={styles.info}>연령 제한: {item.age}세 이상</Text>
                <Text style={styles.info}>인원: {item.playerMin} - {item.playerMax}명</Text>
                <Text style={styles.info}>평균 플레이 시간: {item.playingTime}분</Text>
            </View>
        </Pressable>
        );
});


const PostSubmitScreen = ({navigation}) => {

    const [datas, setDatas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isSelected, setIsSelected] = useState(true);
    const [filteredData, setFilteredData] = useState(datas);
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        call("/api/boardgame","POST").then((response) => {
            setDatas(response);
            setFilteredData(response);
            setLoading(false); // 로딩 완료
        }).catch(() => setLoading(false)); 
    },[]);

    const handleSearch = (text) => {
        setSearchText(text);
        if(text) {
            const filtered = datas.filter((item) => {
                const itemAdd = item.boardGame;
                return itemAdd.includes(text);
            }); 
            setFilteredData(filtered);
        }
        else {
            setFilteredData(datas);
        }
    }
    const handleItemPress = (item) => {
        setSelectedItem(item);
        setIsSelected(false);
    }
    const onSubmit = () => {
        navigation.navigate("PostDetailSubmitScreen",{ selectedItem });
    }
    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>보드게임을 먼저 정해주세요.</Text>
            <Input inputType={InputTypes.SEARCHBOARDGAME} inputStyle={InputStyles.SEARCH} returnKeyType={ReturnKeyTypes.DONE}
                        value={searchText}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={(text) => handleSearch(text)} />
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
            ) : (
                <FlatList 
                    data={filteredData} 
                    renderItem={({ item }) => <ListItem item={item} onPress={handleItemPress} isSelected={selectedItem?.id === item.id}/>}
                    keyExtractor={(item, index) => index.toString()}
                    windowSize={5}
                />
            )}
        <InputFAB icon={'arrow-right'} onPress={onSubmit} disabled={isSelected} />
    </View>);
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
  image: {
      width: 80, // 이미지 너비
      height: 100, // 이미지 높이
      borderRadius: 8, // 이미지 모서리 둥글게
      marginRight: 10, // 이미지와 텍스트 사이 간격
  },
  textContainer: {
      flex: 1,
      justifyContent: "center", // 텍스트를 세로로 가운데 정렬
  },
  title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4, // 하단 간격
  },
  boardgame: {
      fontSize: 30,
      fontWeight: 'bold',
      color: "#666",
      marginBottom: 2,
  },
  loadingIndicator: {
      marginVertical: 20,
  },
});

export default PostSubmitScreen;