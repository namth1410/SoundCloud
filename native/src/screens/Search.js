import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SuggestSongList from "../components/SuggestSongList";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";

export default function Search({}) {
  const { width, height } = Dimensions.get("window");
  const [data, setData] = useState([1, 2, 3, 4]);

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
        <FlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={data}
          style={{ paddingHorizontal: 0 }}
        />

        <TouchableOpacity
          style={{ flexDirection: "row", marginVertical: 15, marginLeft: 10 }}
        >
          {/* <Ionicons name="trash-outline" color="black" size={26} /> */}
          <Text style={{color: "gray"}}>Xóa lịch sử tìm kiếm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
