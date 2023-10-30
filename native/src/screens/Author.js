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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  }, [authorInfoRedux]);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back-outline" size={36} color="#000" />
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
            source={require("../../assets/test.jpg")}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
            {authorInfoRedux.nameAuthor}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <View style={{ alignItems: "center", width: 100 }}>
              <Text>{topPlaylists.length}</Text>
              <Text style={{ color: "grey" }}>Playlist</Text>
            </View>
            <View
              style={{
                height: "30%",
                width: 2,
                backgroundColor: "#000",
                marginVertical: 0,
                borderRadius: 5,
              }}
            />
            <View style={{ alignItems: "center", width: 100 }}>
              <Text>{topSongs.length}</Text>
              <Text style={{ color: "grey" }}>Bài hát</Text>
            </View>
            <View
              style={{
                height: "30%",
                width: 2,
                backgroundColor: "#000",
                marginVertical: 0,
                borderRadius: 5,
              }}
            />
            <View style={{ alignItems: "center", width: 100 }}>
              <Text>143.5</Text>
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
                backgroundColor: "#E7CBCB",
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
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Các bài hát
            </Text>
            <Ionicons name="chevron-forward-outline" size={28} color="#000" />
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
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Các Playlist
            </Text>
            <Ionicons name="chevron-forward-outline" size={28} color="#000" />
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
              backgroundColor: "#F8F0E5",
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
                backgroundColor: "#000",
                marginTop: 5,
                borderRadius: 5,
              }}
            />

            <View
              style={{ width: "100%", marginTop: 20, paddingHorizontal: 15 }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
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

                <Text>
                  https://www.facebook.com/profile.php?id=100053354281854
                </Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
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

                <Text>0345518088</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 10,
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

                <Text>tranhainam1410@gmail.com</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
