import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import CardSongHorizon from "../components/CardSongHorizon";
import { getInfoAuthor } from "../redux/authorSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
export default function SongAuthor({}) {
  const userInfo = useSelector((state) => state.userInfo);
  const authorInfoRedux = useSelector((state) => state.authorInfoRedux);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const { playSound } = useAudio();
  const [data, setData] = useState(authorInfoRedux.songList);
  const [topSongs, setTopSongs] = useState(authorInfoRedux.songList);

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <CardSongHorizon props={{ ...item }}></CardSongHorizon>
      </View>
    );
  };

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
  }, [authorInfoRedux]);

  useEffect(() => {
    dispatch(
      getInfoAuthor({
        idUser: "6b7b2932-dc4c-4b74-bd97-5d552e7d275d",
      })
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <View
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back-outline" size={36} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Các bài hát</Text>
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 15,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              playSound({ uri: topSongs[0].linkSong });
              dispatch(playSong({ ...topSongs[0] }));
              dispatch(
                addHistoryAsync({ ...topSongs[0], token: userInfo.token })
              );
              dispatch(updateDataSuggestSongList(topSongs.slice(1)));
            }}
          >
            <Text
              style={{
                padding: 5,
                textAlign: "center",
                backgroundColor: "#F875AA",
                color: "white",
                borderRadius: 100,
                width: 0.6 * width,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Phát danh sách
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: width, height: 0.72 * height }}>
          <FlatList
            data={topSongs}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ paddingHorizontal: 0, marginTop: 10 }}
          />
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
      </View>

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
