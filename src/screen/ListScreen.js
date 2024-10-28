import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { FlatList, Image, Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { call } from "../service/Apiservice";
import InputFAB from "../components/InputFAB";
import * as SecureStore from "expo-secure-store";
import EmptyListScreen from "./EmptyListScreen";
import UserContext from "../contexts/UserContext";
import { API_BASE_URL } from "../app-config";
import { GRAY, PRIMARY, WHITE } from "../colors";
import Input, { InputStyles, InputTypes, ReturnKeyTypes } from "../components/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SafeInputView from "../components/SafeInputView";
import { useFocusEffect } from "@react-navigation/native";

const ListItem = ({item, onPress}) => {
    const imageUrl = `${API_BASE_URL}/images/${encodeURIComponent(item.boardgame + '.jpg')}`;
    return (
        <Pressable onPress={() => onPress(item)}
        style= {({pressed}) => [
            styles.card,
            {backgroundColor : pressed ? '#dddddd' : WHITE},
        ]}>
            <Image source={{ uri: imageUrl }} style={styles.image} /> 
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.boardgame}>보드게임: {item.boardgame}</Text> 
                <Text style={styles.nickname}>작성자: {item.nickname}</Text> 
                <Text style={styles.participants}>
                    참가 인원: {item.userNum} / {item.limitUser} 
                </Text>
                <Text style={styles.address}>위치: {item.address}</Text> 
            </View>
        </Pressable>
        );
};


const ListScreen = ({ navigation }) => {
    const [matchingPosts, setMatchingPosts] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [isSearching, setIsSearching] = useState(false);
    const [isMap, setIsMap] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(matchingPosts);
    const render = () => {
        call("/api/matchingposts","POST",{ userId: user }).then((response) => {
            setMatchingPosts(response);
            setFilteredData(response);
        });
    }

    setUser(SecureStore.getItem("userId"))
    useFocusEffect(
        useCallback(() => {
            render();
        }, [])
    );

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // 데이터를 다시 불러오거나 새로고침 작업 수행
        setTimeout(() => {
            // 여기에서 데이터 로드 후 상태 업데이트
            render();
            setRefreshing(false);
        }, 2000); // 예시로 2초 후 새로고침 종료
    };

    useEffect(() => {
        render();
    },[user]);

    const handleItemPress = (item) => {
        navigation.navigate('PostScreen', { item: item } );
    }
    const handleSearch = (text) => {
        setSearchText(text);

        if(text) {
            const filtered = matchingPosts.filter((item) => {
                if(isMap) {
                    const itemAdd = item.address;
                    return itemAdd.includes(text);
                }
                else {
                    const itemAdd = item.boardgame;
                    return itemAdd.includes(text);
                }
            });
            setFilteredData(filtered);
        }
        else {
            setFilteredData(matchingPosts);
        }
    }
    const onSubmit = () => {
        navigation.navigate('PostSubmitScreen');
    }
    const onSearchChange = () => {
        setIsMap(!isMap);
    }

    return matchingPosts.length ? (<SafeInputView>
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Input inputType={isMap ? InputTypes.SEARCHMAP : InputTypes.SEARCHBOARDGAME } inputStyle={InputStyles.SEARCH} returnKeyType={ReturnKeyTypes.DONE}
                        value={searchText}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={(text) => handleSearch(text)} />
                <MaterialCommunityIcons name={isMap ? "map-marker" : "view-dashboard"} onPress={onSearchChange} size={28} color={PRIMARY.DARK} style={{position:'absolute', right: 15}}/>
            </View>
            <FlatList data={filteredData} renderItem={({item}) => <ListItem item={item} onPress={handleItemPress} />}
            keyExtractor={(item, index) => index.toString()}
            windowSize={5}
            refreshing={refreshing}
            onRefresh={onRefresh}/>
            <InputFAB icon={'plus'} onPress={onSubmit} disabled={false} />
        </View>
    </SafeInputView>) : (
        <View style={styles.container}>
            <EmptyListScreen />
            <InputFAB icon={'plus'} onPress={onSubmit} disabled={false} />
        </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    poststyle: {
        paddingVertical: 10, 
        paddingHorizontal: 20,
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
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    nickname: {
        fontSize: 14,
        color: "#777",
        marginBottom: 2,
    },
    participants: {
        fontSize: 14,
        color: "#777",
        marginBottom: 2,
    },
    address: {
        fontSize: 13,
        color: "#999",
    },
});

export default ListScreen;