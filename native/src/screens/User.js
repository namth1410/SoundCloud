import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { getSongsFromPlaylist } from "../redux/playlistDetailSlice";

import { postSongFromUserAsync } from "../redux/audioCloudSlice";
export default function User({}) {
  const userInfoRedux = useSelector((state) => state.userInfo);
  const allSongRedux = useSelector((state) => state.allSong);
  const playlistRedux = useSelector((state) => state.playlistRedux);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  const ItemPlaylist = (playlist) => {
    return (
      <TouchableOpacity
        delayPressIn={1000}
        onPressOut={() => {
          dispatch(
            getSongsFromPlaylist({
              idPlaylist: playlist.id,
              token: userInfoRedux.token,
            })
          ).then(() => {});
          navigation.navigate("PlaylistDetail", { data: playlist });
        }}
      >
        <View style={{ width: 138 }}>
          <Image
            style={{
              resizeMode: "contain",
              width: 120,
              height: 120,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={
              playlist.imgFirstSong === null ||
              playlist.imgFirstSong === "" ||
              playlist.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: playlist.imgFirstSong }
            }
          />
          <Image
            blurRadius={10}
            style={{
              resizeMode: "cover",
              width: 120,
              height: 120,
              borderRadius: 5,
              position: "absolute",
              top: 8,
              left: 8,
            }}
            source={
              playlist.imgFirstSong === null ||
              playlist.imgFirstSong === "" ||
              playlist.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: playlist.imgFirstSong }
            }
          />
          <View
            style={{
              zIndex: 3,
              flexDirection: "row",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              position: "absolute",
              top: 90,
              left: 70,
            }}
          >
            <Icon
              style={{ marginHorizontal: 5 }}
              name="bars"
              size={14}
              color="white"
            />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
              {playlist.numberTrack}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "space-between",
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white", fontSize: 14 }}
            >
              {playlist.namePlaylist}
            </Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              marginTop: 2,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 12,
            }}
          >
            {playlist.access === "public" ? "Công khai" : "Riêng tư"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const AddNewItemPlaylist = (playlist) => {
    return (
      <TouchableOpacity delayPressIn={1000}>
        <View style={{ width: 138 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 5,
              zIndex: 2,
              backgroundColor: "black",
            }}
          />
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 5,
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "black",
            }}
          />
          <View
            style={{
              padding: 10,
              borderRadius: 15,
              position: "absolute",
              top: 35,
              left: 40,
              backgroundColor: "#272727",
              zIndex: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="add-outline" color="white" size={26} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "space-between",
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white", fontSize: 14 }}
            >
              Danh sách mới
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "rgb(15,15,15)",
          width: width,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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

          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="settings-outline" size={26} color="gray" />
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
              flexDirection: "row",
              marginLeft: 10,
            }}
          >
            <Image
              style={{
                resizeMode: "contain",
                width: 80,
                height: 80,
                borderRadius: 500,
                zIndex: 20,
              }}
              src={userInfoRedux.avatar ?? require("../../assets/musique.jpg")}
            />
            <View
              style={{
                justifyContent: "center",
                marginLeft: 10,
                paddingBottom: 15,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "white",
                  width: 250,
                }}
              >
                {userInfoRedux.name}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: "grey",
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 2,
                  width: 100,
                  marginTop: 5,
                }}
              >
                <Text style={{ fontSize: 10 }}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            // chuyển đổi tài khoản
          }

          <View
            style={{ marginLeft: 10, marginVertical: 15, width: width - 10 }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "#272727",
                  borderRadius: 500,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="people-outline" size={14} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Chuyển đổi tài khoản
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "#272727",
                  borderRadius: 500,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="logo-google" size={14} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Tài khoản Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "#272727",
                  borderRadius: 500,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="user-secret" size={14} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Chế độ không đăng nhập
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {
            // danh sach phat
          }
          <View style={{ width: width }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                Danh sách phát
              </Text>
              <TouchableOpacity
                onPressOut={() => {
                  navigation.navigate("Playlist");
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 500,
                  paddingVertical: 3,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
              horizontal
              style={{ marginLeft: 10, marginTop: 10 }}
            >
              {playlistRedux.playlistList.slice(0, 5).map((playlist, index) => (
                <View key={index} style={{ marginRight: 15 }}>
                  <ItemPlaylist {...playlist}></ItemPlaylist>
                </View>
              ))}
              <AddNewItemPlaylist></AddNewItemPlaylist>
            </ScrollView>
          </View>

          {
            // option 1
          }
          <View style={{ paddingHorizontal: 25, marginTop: 20 }}>
            <TouchableOpacity
              delayPressIn={1000}
              onPressOut={() => {
                navigation.navigate("UploadFromUser");
              }}
              style={{ flexDirection: "row" }}
            >
              <Ionicons name="cloud-done-outline" color="#F57C1F" size={30} />
              <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                Cloud của bạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              delayPressIn={1000}
              style={{ flexDirection: "row", marginTop: 15 }}
            >
              <Ionicons name="heart-outline" color="#F57C1F" size={30} />
              <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                Yêu thích
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              delayPressIn={1000}
              onPressOut={() => {
                navigation.navigate("History");
              }}
              style={{ flexDirection: "row", marginTop: 15 }}
            >
              <Ionicons name="book-outline" color="#F57C1F" size={30} />
              <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                Lịch sử nghe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              delayPressIn={1000}
              onPressOut={() => {
                navigation.navigate("ManageStorage");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Ionicons name="download-outline" color="#F57C1F" size={30} />
              <View>
                <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                  Nội dung tải xuống
                </Text>
                <Text
                  style={{ color: "#ABABAB", marginLeft: 20, fontSize: 14 }}
                >
                  10 Tracks
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {
            // option 2
          }

          <View
            style={{
              paddingHorizontal: 25,
              marginTop: 20,
              borderWidth: 1,
              borderTopColor: "#F57C1F",
            }}
          >
            <TouchableOpacity style={{ flexDirection: "row", marginTop: 15 }}>
              <Ionicons name="stats-chart-outline" color="#F57C1F" size={30} />
              <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                Thời lượng nghe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: "row", marginTop: 15 }}>
              <Ionicons name="help-circle-outline" color="#F57C1F" size={30} />
              <Text style={{ color: "white", marginLeft: 20, fontSize: 16 }}>
                Trợ giúp và phản hồi
              </Text>
            </TouchableOpacity>
          </View>
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
