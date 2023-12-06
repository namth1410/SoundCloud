import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import CardPlaylist from "../components/CardPlaylist";
import CardSongSmall from "../components/CardSongSmall";
export default function Author({}) {
  const authorInfoRedux = useSelector((state) => state.authorInfoRedux);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);

  const [topSongs, setTopSongs] = useState([]);
  const [topPlaylists, setTopPlaylists] = useState([]);
  const [likes, setLikes] = useState(0);
  const value = new Animated.Value(0);

  useEffect(() => {
    if (modalVisible) {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const opacity = value;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          // Nếu người dùng vuốt xuống hơn 50 pixels, ẩn modal
          setModalVisible(false);
        }
      },
    })
  ).current;

  useEffect(() => {
    setTopSongs(authorInfoRedux.songList);
    setTopPlaylists(authorInfoRedux.playlistList);
    let a = 0;
    authorInfoRedux.songList.forEach((element) => {
      a += element.likes;
    });
    setLikes(a);
  }, [authorInfoRedux]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15,15,15)" }}>
      <ScrollView>
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back-outline" size={36} color="#F57C1F" />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              resizeMode: "contain",
              width: 150,
              height: 150,
              borderRadius: 1000,
            }}
            source={
              authorInfoRedux.avatar === null ||
              authorInfoRedux.avatar === "" ||
              authorInfoRedux.avatar === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: authorInfoRedux.avatar }
            }
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            {authorInfoRedux.nameAuthor}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={{ color: "white" }}>{topPlaylists.length}</Text>
              <Text style={{ color: "grey" }}>Playlist</Text>
            </View>
            <View
              style={{
                height: "30%",
                width: 2,
                backgroundColor: "#A3A1A2",
                marginVertical: 0,
                borderRadius: 5,
              }}
            />
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={{ color: "white" }}>{topSongs.length}</Text>
              <Text style={{ color: "grey" }}>Bài hát</Text>
            </View>
            <View
              style={{
                height: "30%",
                width: 2,
                backgroundColor: "#A3A1A2",
                marginVertical: 0,
                borderRadius: 5,
              }}
            />
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={{ color: "white" }}>{likes}</Text>
              <Text style={{ color: "grey" }}>Thích</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <View
              style={{
                width: "auto",
                height: 50,
                backgroundColor: "rgb(150,150,150)",
                marginTop: 10,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ marginRight: 10, fontSize: 16, fontWeight: "bold" }}
                >
                  Thông tin liên hệ
                </Text>
                <Ionicons name="eye-outline" size={24} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 15,
            display: topSongs.length === 0 ? "none" : "flex",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SongAuthor");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              Các bài hát
            </Text>
            <Ionicons name="chevron-forward-outline" size={28} color="white" />
          </TouchableOpacity>
          {topSongs.slice(0, 3).map((song, index) => (
            <View key={index} style={{ marginVertical: 5 }}>
              <CardSongSmall props={song}></CardSongSmall>
            </View>
          ))}
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 15,
            display: topPlaylists.length === 0 ? "none" : "flex",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              Các Playlist
            </Text>
            <Ionicons name="chevron-forward-outline" size={28} color="white" />
          </TouchableOpacity>
          {topPlaylists.slice(0, 3).map((playlist, index) => (
            <View
              key={index}
              style={{ marginVertical: 5, marginHorizontal: 10 }}
            >
              <CardPlaylist props={{ ...playlist }}></CardPlaylist>
            </View>
          ))}
        </View>

        <Animated.View
          style={{
            opacity: opacity,
            backgroundColor: "#000",
            width: width,
            height: height,
            position: "absolute",
            display: modalVisible ? "flex" : "none",
          }}
          // style={{
          //   opacity: modalVisible ? 0.8 : 0,
          //   backgroundColor: "#000",
          //   width: width,
          //   height: height,
          //   position: "absolute",
          //   display: modalVisible ? "flex" : "none"

          // }}
        ></Animated.View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                width: "100%",
                height: 0.5 * height,
                top: 0,
                left: 0,
                opacity: 0,
              }}
            ></View>
          </TouchableWithoutFeedback>
          <View
            {...panResponder.panHandlers}
            style={{
              backgroundColor: "#1A1A1A",
              width: "100%",
              height: 0.5 * height,
              top: 0.5 * height + 20,
              left: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              position: "absolute",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 0.2 * width,
                height: 3,
                backgroundColor: "white",
                marginTop: 5,
                borderRadius: 5,
              }}
            />

            <View
              style={{ width: "100%", marginTop: 20, paddingHorizontal: 15 }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    style={{ marginRight: 10, marginLeft: 5 }}
                    name="facebook"
                    size={24}
                    color="#1877F2"
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
                      color: "white",
                    }}
                  >
                    Facebook{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setStringAsync("hello world");
                    }}
                  >
                    <Ionicons name="copy-outline" color="grey" size={24} />
                  </TouchableOpacity>
                </View>

                <Text style={{ color: "white" }}>
                  https://www.facebook.com/profile.php?id=100053354281854
                </Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    style={{ marginRight: 10, marginLeft: 5 }}
                    name="phone"
                    size={24}
                    color="green"
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
                      color: "white",
                    }}
                  >
                    Số điện thoại{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setStringAsync("hello world");
                    }}
                  >
                    <Ionicons name="copy-outline" color="grey" size={24} />
                  </TouchableOpacity>
                </View>

                <Text style={{ color: "white" }}>0345518088</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    style={{ marginRight: 10, marginLeft: 5 }}
                    name="at"
                    size={24}
                    color="pink"
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
                      color: "white",
                    }}
                  >
                    Email{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setStringAsync("hello world");
                    }}
                  >
                    <Ionicons name="copy-outline" color="grey" size={24} />
                  </TouchableOpacity>
                </View>

                <Text style={{ color: "white" }}>tranhainam1410@gmail.com</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
