import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { postSongFromUserAsync } from "../redux/songSlice";
import { downloadFromUrl, uploadFileToFirebase } from "../ultis/FileHelper";
export default function User({}) {
  const userInfo = useSelector((state) => state.userInfo);
  const allSongRedux = useSelector((state) => state.allSong);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const testUpload = async () => {
    if (userInfo.token) {
      let linkSong = null;
      const a = async () => {
        linkSong = await uploadFileToFirebase();
      };
      await a();

      if (linkSong) {
        dispatch(
          postSongFromUserAsync({
            nameSong: "Tran Nam Test",
            linkSong: linkSong,
            token: userInfo.token,
          })
        );
      } else {
        console.log("XIt");
      }
    } else {
      alert("Phải đăng nhập");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "#F57C1F",
            }}
          >
            Cá nhân
          </Text>

          <TouchableOpacity onPress={testUpload}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="cloud-upload" size={36} color="#F57C1F" />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  color: "#F57C1F",
                  paddingLeft: 10,
                }}
              >
                Upload
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UploadFromUser");
            }}
          >
            <Option title="Danh sách nhạc đã tải lên"></Option>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("History");
            }}
          >
            <Option title="Lịch sử"></Option>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ManageStorage");
            }}
          >
            <Option title="Lưu trữ"></Option>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Playlist");
            }}
          >
            <Option title="Playlist"></Option>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              downloadFromUrl(allSongRedux.songs[7]);
              // playSound({
              //   uri: `file:///data/user/0/host.exp.exponent/files/SoundCloud_C%C3%A1nh%20thi%E1%BB%87p%20%C4%91%E1%BA%A7u%20xu%C3%A2n`,
              // });
            }}
          >
            <Option title="Test DownLoad"></Option>
          </TouchableOpacity>
          <Option title="Tracks yêu thích"></Option>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const Option = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 5,
      }}
    >
      <Text style={{ fontSize: 15 }}>{title}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={30}
        color="#F57C1F"
        style={{ justifyContent: "flex-end" }}
      />
    </View>
  );
};
