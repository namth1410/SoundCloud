import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { getInfoAuthor } from "../redux/authorSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import {
  addSongLike,
  addSongLikeAsync,
  deleteSongLike,
  deleteSongLikeAsync,
} from "../redux/songLikeSlice";

import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
export default function CardSongHorizon({ props }) {
  const { img, nameSong, nameAuthor, playing, linkSong } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const userInfoRedux = useSelector((state) => state.userInfo);
  const songLikeRedux = useSelector((state) => state.songLikeRedux);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);

  const [isLiked, setIsLiked] = useState(false);

  const { playSound } = useAudio();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          setModalVisible(false);
        }
      },
    })
  ).current;

  const handleLike = async () => {
    try {
      if (userInfoRedux.token) {
        if (!isLiked) {
          setIsLiked(true);
          dispatch(addSongLike(props));
          await dispatch(
            addSongLikeAsync({
              idSong: props.id,
              token: userInfoRedux.token,
            })
          )
            .then(() => {
              setModalVisible(false);
              ToastAndroid.show("Thêm thành công", ToastAndroid.SHORT);
            })
            .catch((error) => {
              console.error(
                "Action addSongLike bị từ chối hoặc gặp lỗi:",
                error
              );
              setIsLiked(false);
            });
        } else {
          setIsLiked(false);
          dispatch(deleteSongLike(props));
          await dispatch(
            deleteSongLikeAsync({
              idSong: props.id,
              token: userInfoRedux.token,
            })
          )
            .then(() => {
              setModalVisible(false);
              ToastAndroid.show("Xóa thành công", ToastAndroid.SHORT);
            })
            .catch((error) => {
              console.error(
                "Action deleteSongLike bị từ chối hoặc gặp lỗi:",
                error
              );
              setIsLiked(true);
            });
        }
      } else {
        alert("Chưa đăng nhập");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSongToQueue = () => {
    let newSuggestSongList = [...suggestSongRedux.suggestSongList];
    const existingSongIndex = suggestSongRedux.suggestSongList.findIndex(
      (song) => song.id === props.id
    );
    if (existingSongIndex !== -1) {
      newSuggestSongList = suggestSongRedux.suggestSongList.filter(
        (song, index) => index !== existingSongIndex
      );
    }
    newSuggestSongList = [props, ...newSuggestSongList];
    dispatch(updateDataSuggestSongList(newSuggestSongList));
    setModalVisible(false);
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

      if (songLikeRedux.songLikeList) {
        setIsLiked(
          songLikeRedux.songLikeList.some((item) => item.id === props.id)
        );
      }
    }
  }, [modalVisible]);

  const opacity = value;

  return (
    <View
      style={{
        width: "94%",
        flexDirection: "row",
        marginHorizontal: 10,
        paddingLeft: 10,
        paddingVertical: 5,
        overflow: "visible",
        backgroundColor: "#B9B4C7",
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPressOut={() => {
          playSound({ uri: linkSong });
          dispatch(addHistoryAsync({ ...props, token: userInfoRedux.token }));
          dispatch(playSong(props));
        }}
      >
        <Image
          style={{
            resizeMode: "cover",
            width: 50,
            height: 50,
            borderRadius: 5,
            zIndex: 2,
          }}
          source={img ?? require("../../assets/gai.jpg")}
        />
        <View
          style={{
            flexDirection: "column",
            marginLeft: 15,
            width: 0.65 * width,
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontWeight: "bold" }}
          >
            {nameSong}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginTop: 2,
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: 12,
            }}
          >
            {nameAuthor}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Ionicons
            name="ellipsis-vertical-outline"
            size={28}
            color="#000"
            style={{
              textAlignVertical: "center",
            }}
          />
        </TouchableOpacity>
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
              style={{
                width: "90%",
                flexDirection: "row",
                paddingTop: 5,
                paddingBottom: 10,
                marginVertical: 5,
                overflow: "visible",
                borderBottomWidth: 1,
                borderBottomColor: "grey",
              }}
            >
              <Image
                style={{
                  resizeMode: "cover",
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  zIndex: 2,
                }}
                source={require("../../assets/gai.jpg")}
              />
              <View
                style={{
                  flexDirection: "column",
                  marginLeft: 15,
                  width: 0.55 * width,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontWeight: "bold" }}
                >
                  {props.nameSong}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    marginTop: 2,
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: 12,
                  }}
                >
                  {nameAuthor}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexGrow: 1,
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 5,
                  }}
                >
                  <Ionicons color="black" name="download-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Tải xuống
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPressOut={() => {
                  handleLike();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  {isLiked ? (
                    <Ionicons name="heart" color="red" size={30} />
                  ) : (
                    <Ionicons name="heart-outline" size={30} />
                  )}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    {isLiked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPressOut={() => {
                  addSongToQueue();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons
                    color="black"
                    name="musical-notes-outline"
                    size={30}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Xóa khỏi tải lên
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons color="black" name="list-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Thêm vào playlist
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    getInfoAuthor({
                      idUser: props.idUser,
                    })
                  );
                  navigation.navigate("Author");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons color="black" name="person-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Xem tác giả
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
