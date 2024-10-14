import { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { call } from "../service/Apiservice";

const ListItem = memo(({item}) => {
    console.log(item.value);
    return (
        <View style={styles.poststyle}>
            <Text style={{fontSize: 20}}>{item.value}</Text>
        </View>
        );
});


const ListScreen = () => {
    const matchingPosts = [];
    call("/api/").then((response) => {
        matchingPosts.push();
    })
    for (let i = 0 ; i < 501; i++) {
        matchingPosts.push({ value: i});
    }
    return (<View style={styles.container}>
        <FlatList data={matchingPosts} renderItem={({item}) => <ListItem item={item}/>}
        windowSize={5}/>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    poststyle: {
        paddingVertical: 10, 
        paddingHorizontal: 20,
    }
});

export default ListScreen;