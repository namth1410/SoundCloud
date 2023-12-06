import {
    SafeAreaView,
    Text,
    View,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
    Image,
  } from "react-native";
  import SuggestSongList from "../components/SuggestSongList";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import React, { useEffect, useRef, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { SearchByKeyWord } from "../redux/searchSlice";
  import { useNavigation } from "@react-navigation/native";
  import { getInfoAuthor } from "../redux/authorSlice";
  
  
  
  export default function SearchDetail({}) {
    const { width, height } = Dimensions.get("window");
    const dispatch = useDispatch();
    const navigation = useNavigation();
  
    const searchRedux = useSelector((state) => state.searchRedux);
    const [dataAuthors, setDataAuthors] = useState(searchRedux.authorsResult);
    const [dataSongs, setDataSongs] = useState(searchRedux.songsResult);
    const renderItemAuthor = ({ item }) => {
      return (
        <TouchableOpacity
          onPressOut={() => {
            dispatch(
              getInfoAuthor({
                idUser: item.id,
              })
            );
            navigation.navigate("Author");
          }}
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Image
            style={{
              resizeMode: "contain",
              width: 40,
              height: 40,
              borderRadius: 1000,
            }}
            source={
              item.avatar
                ? { uri: item.avatar }
                : require("../../assets/anonymous.jpg")
            }
          />
          <Text style={{ fontWeight: "bold", color: "black", marginLeft: 10 }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };
  
    const renderItemSong = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Image
            style={{
              resizeMode: "contain",
              width: 40,
              height: 40,
              borderRadius: 5,
            }}
            source={
              item.avatar
                ? { uri: item.img }
                : require("../../assets/anonymous.jpg")
            }
          />
          <View style={{ width: "80%" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              {item.nameSong}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: "rgba(0,0,0,0.5)",
                marginLeft: 10,
              }}
            >
              {item.nameAuthor}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
  
    const renderItem = ({ item }) => {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>viet anh 26</Text>
          <TouchableOpacity>
            <Ionicons name="close-outline" color="black" size={30} />
          </TouchableOpacity>
        </View>
      );
    };
  
    useEffect(() => {
      setDataAuthors(searchRedux.authorsResult.slice(0, 3));
      setDataSongs(searchRedux.songsResult.slice(0, 3));
    }, [searchRedux]);
  
    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View
          style={{
            backgroundColor: "#E7CBCB",
            width: "90%",
            height: 50,
            flexDirection: "row",
            alignSelf: "center",
            borderRadius: 5,
            marginTop: 10,
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <Ionicons name="search-outline" color="black" size={30} />
          <TextInput
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
            onChangeText={(value) => {
              if (value) {
                dispatch(SearchByKeyWord(value));
              } else {
                setDataAuthors([]);
                setDataSongs([]);
              }
            }}
          ></TextInput>
        </View>
  
        <View
          style={{
            width: "90%",
            height: "auto",
            backgroundColor: "#E7CBCB",
            alignSelf: "center",
            marginTop: 15,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 10,
              marginLeft: 10,
              display: dataSongs.length > 0 ? "flex" : "none",
            }}
          >
            Tracks
          </Text>
          <FlatList
            data={dataSongs}
            onDragEnd={({ data }) => setDataSongs(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItemSong}
            extraData={dataSongs}
            style={{ paddingHorizontal: 0 }}
            initialNumToRender={3}
          />
  
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 10,
              marginLeft: 10,
              display: dataAuthors.length > 0 ? "flex" : "none",
            }}
          >
            Người dùng
          </Text>
  
          <FlatList
            data={dataAuthors}
            onDragEnd={({ data }) => setDataAuthors(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItemAuthor}
            extraData={dataAuthors}
            style={{ paddingHorizontal: 0 }}
            initialNumToRender={3}
          />
  
          <TouchableOpacity
            style={{ flexDirection: "row", marginVertical: 15, marginLeft: 10 }}
          >
            {/* <Ionicons name="trash-outline" color="black" size={26} /> */}
            <Text style={{ color: "gray" }}>Xóa lịch sử tìm kiếm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  