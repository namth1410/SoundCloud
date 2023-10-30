import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { postSongFromUserAsync } from "../redux/songSlice";
import { uploadFileToFirebase } from "../ultis/FileHelper";
export default function User({}) {
  const userInfo = useSelector((state) => state.userInfo);
  const allSongRedux = useSelector((state) => state.allSong);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

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
          width: width,
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

        <ScrollView
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: width,
          }}
        >
          <View
            style={{
              width: width,
              height: 0.4 * width,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UploadFromUser");
              }}
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="cloud-upload" color="#00B6FF" size={26} />

              <Text style={{ fontWeight: "bold", color: "#00B6FF" }}>
                Tải lên
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="heart" color="#00B6FF" size={26} />

              <Text style={{ fontWeight: "bold", color: "#00B6FF" }}>
                Yêu thích
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width,
              height: 0.4 * width,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="settings" color="grey" size={26} />

              <Text style={{ fontWeight: "bold", color: "grey" }}>Cài đặt</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width,
              height: 0.4 * width,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("History");
              }}
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="cloud-upload" color="#00B6FF" size={26} />

              <Text style={{ fontWeight: "bold", color: "#00B6FF" }}>
                Nghe gần đây
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Playlist");
              }}
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="heart" color="#00B6FF" size={26} />

              <Text style={{ fontWeight: "bold", color: "#00B6FF" }}>
                Playlist
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width,
              height: 0.4 * width,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ManageStorage");
              }}
              style={{
                width: 0.35 * width,
                aspectRatio: 1,
                backgroundColor: "#E7CBCB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="arrow-down-circle" color="grey" size={26} />

              <Text style={{ fontWeight: "bold", color: "grey" }}>Đã tải</Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
