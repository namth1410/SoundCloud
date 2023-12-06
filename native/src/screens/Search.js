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
  ScrollView,
} from "react-native";
import SuggestSongList from "../components/SuggestSongList";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchByKeyWord } from "../redux/searchSlice";
import { useNavigation } from "@react-navigation/native";
import { getInfoAuthor } from "../redux/authorSlice";
import { Tab, TabView } from "@rneui/themed";
import CardTrackSearch from "../components/CardTrackSearch";
import CardPlaylist from "../components/CardPlaylist";

export default function Search({}) {
  const { width, height } = Dimensions.get("window");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const searchRedux = useSelector((state) => state.searchRedux);
  const [indexTab, setIndexTab] = React.useState(0);
  const [dataAuthors, setDataAuthors] = useState(searchRedux.authorsResult);
  const [dataSongs, setDataSongs] = useState(searchRedux.songsResult);
  const [dataPlaylists, setDataPlaylists] = useState(
    searchRedux.playlistsResult
  );

  const [textSearch, setTextSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputTextRef = useRef();
  const handleFocus = () => {
    setIsFocused(true);
  };

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

  const renderItemAuthorV2 = ({ item }) => {
    return (
      <TouchableOpacity
        delayPressIn={1000}
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
          marginVertical: 15,
          alignItems: "center",
          height: "auto",
        }}
      >
        <Image
          style={{
            resizeMode: "contain",
            width: 100,
            height: 100,
            borderRadius: 1000,
          }}
          source={
            item.avatar
              ? { uri: item.avatar }
              : require("../../assets/anonymous.jpg")
          }
        />
        <View
          style={{
            flexDirection: "column",
            height: 100,
            flex: 1,
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              marginLeft: 10,
              fontSize: 18,
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" color="#A3A1A2" size={16} />

            <Text style={{ color: "#A3A1A2", fontSize: 14, marginLeft: 5 }}>
              Ha Noi
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="musical-notes-outline" color="#A3A1A2" size={16} />

            <Text style={{ color: "#A3A1A2", fontSize: 14, marginLeft: 5 }}>
              {`${item.trackCount} Tracks`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemSongV2 = ({ item }) => {
    return (
      <View style={{ marginBottom: 8 }}>
        <CardTrackSearch props={item}></CardTrackSearch>
      </View>
    );
  };

  const renderItemPlaylistV2 = ({ item }) => {
    return (
      <View style={{ paddingHorizontal: 15 }}>
        <CardPlaylist props={item}></CardPlaylist>
      </View>
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
    setDataAuthors(searchRedux.authorsResult);
    setDataSongs(searchRedux.songsResult);
    setDataPlaylists(searchRedux.playlistsResult);
  }, [searchRedux]);

  useEffect(() => {
    setDataAuthors([]);
    setDataSongs([]);
    setDataPlaylists([]);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "rgb(15,15,15)", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#272727",
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
        <Ionicons name="search-outline" color="white" size={30} />
        <TextInput
          ref={inputTextRef}
          onFocus={handleFocus}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholderTextColor="#A3A1A2"
          placeholder="Tìm kiếm ..."
          style={{ flex: 1, marginLeft: 10, fontSize: 16, color: "white" }}
          onChangeText={(value) => {
            setTextSearch(value);
            if (value.trim()) {
              dispatch(SearchByKeyWord(value.trim()));
            } else {
              setDataAuthors([]);
              setDataSongs([]);
              setDataPlaylists([]);
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
          position: "absolute",
          top: 60,
          display: isFocused ? "flex" : "none",
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

      <View style={{ backgroundColor: "rgb(15,15,15)", flex: 1 }}>
        <Tab
          titleStyle={{ color: "white", fontSize: 12 }}
          indicatorStyle={{ backgroundColor: "#F57C1F" }}
          value={indexTab}
          onChange={setIndexTab}
        >
          <Tab.Item>Tracks</Tab.Item>
          <Tab.Item>Người</Tab.Item>
          <Tab.Item>Playlists</Tab.Item>
        </Tab>
        <TabView value={indexTab} onChange={setIndexTab} animationType="spring">
          <TabView.Item style={{ width: "100%" }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 20,
                  marginBottom: 5,
                  display: textSearch ? "flex" : "none",
                  color: "#A3A1A2",
                }}
              >
                {`Tìm thấy ${dataSongs.length} Tracks`}
              </Text>
              <FlatList
                data={dataSongs}
                keyExtractor={(item) => item.id}
                renderItem={renderItemSongV2}
                extraData={dataSongs}
                style={{ paddingHorizontal: 0 }}
              />
            </View>
          </TabView.Item>

          <TabView.Item style={{ width: "100%" }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 20,
                  marginBottom: 5,
                  color: "#A3A1A2",
                  display: textSearch ? "flex" : "none",
                }}
              >
                {`Tìm thấy ${dataAuthors.length} người dùng`}
              </Text>
              <FlatList
                data={dataAuthors}
                keyExtractor={(item) => item.id}
                renderItem={renderItemAuthorV2}
                extraData={dataAuthors}
                style={{ paddingHorizontal: 0 }}
                initialNumToRender={3}
              />
            </View>
          </TabView.Item>

          <TabView.Item style={{ width: "100%" }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 20,
                  marginBottom: 5,
                  color: "#A3A1A2",
                  display: textSearch ? "flex" : "none",
                }}
              >
                {`Tìm thấy ${dataPlaylists.length} playlist`}
              </Text>
              <FlatList
                data={dataPlaylists}
                keyExtractor={(item) => item.id}
                renderItem={renderItemPlaylistV2}
                extraData={dataPlaylists}
                style={{ paddingHorizontal: 0 }}
                initialNumToRender={3}
              />
            </View>
          </TabView.Item>
        </TabView>
      </View>
    </SafeAreaView>
  );
}
