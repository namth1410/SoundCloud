import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { addHistoryAsync, deleteHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";

export default function CardSongForHistory({ props }) {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const { width, height } = Dimensions.get("window");
  const songLikeRedux = useSelector((state) => state.songLikeRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const { playSound } = useAudio();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const toggeleModal = () => {
    setModalVisible(!modalVisible);
  };

  const deleteHistory = async () => {
    await dispatch(
      deleteHistoryAsync({ idSong: id, token: userInfoRedux.token })
    ).then(() => {
      ToastAndroid.show("Xóa thành công", ToastAndroid.SHORT);
    });
  };

  const playSoundAction = async () => {
    if (nameSong !== playSongStore.infoSong.nameSong) {
      playSound(props);
    } else {
    }
  };

  useEffect(() => {
    if (songLikeRedux.songLikeList) {
      setIsLiked(songLikeRedux.songLikeList.some((item) => item.id === id));
    }
  }, []);

  return (
    <SafeAreaView>
      <TouchableOpacity
        delayPressIn={1000}
        onPressOut={() => playSoundAction()}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 5,
            marginBottom: 15,
            overflow: "visible",
            backgroundColor: "rgb(15,15,15)",
            borderRadius: 5,
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
            source={
              props.img === null || props.img === "" || props.img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: props.img }
            }
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.55 * width,
              backgroundColor: "rgb(15,15,15)",
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {props.nameSong}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                marginTop: 2,
                color: "#A3A1A2",
                fontSize: 12,
              }}
            >
              {nameAuthor}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <TouchableOpacity style={{ paddingLeft: 10 }}>
              {isLiked ? (
                <Ionicons name="heart" color="pink" size={24} />
              ) : (
                // <Ionicons name="heart-outline" size={24} />
                <></>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggeleModal();
              }}
            >
              <Ionicons color="#A3A1A2" name="ellipsis-vertical" size={24} />
            </TouchableOpacity>
            {/* <Menu
                renderer={Popover}
                rendererProps={{ placement: "top" }}
                style={{ width: "auto", height: "auto", borderRadius: 5 }}
              >
                <MenuTrigger
                  style={{ width: "auto", height: "auto" }}
                  customStyles={{
                    triggerWrapper: {},
                  }}
                >
                  <Ionicons name="ellipsis-vertical-outline" size={32} />
                </MenuTrigger>
                <MenuOptions customStyles={optionsStyles}>
                  <MenuOption
                    onSelect={() => {
                      alert("download");
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ paddingRight: 15 }}>Tải xuống</Text>
                    <Ionicons name="cloud-download-outline" size={32} />
                  </MenuOption>
                  <MenuOption onSelect={() => alert(`Save`)} text="Save" />
                  <MenuOption onSelect={() => alert(`Delete`)} text="Delete" />
                </MenuOptions>
              </Menu> */}
          </View>
        </View>
      </TouchableOpacity>
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
              backgroundColor: "rgb(50,50,50)",
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
                source={
                  props.img === null || props.img === "" || props.img === "null"
                    ? require("../../assets/unknow.jpg")
                    : { uri: props.img }
                }
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
                  style={{ fontWeight: "bold", color: "white" }}
                >
                  {props.nameSong}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    marginTop: 2,
                    color: "#A3A1A2",
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
                  <Ionicons color="white" name="download-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    Tải xuống
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons
                    color="white"
                    name="musical-notes-outline"
                    size={30}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    Thêm vào hàng chờ phát
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
                  <Ionicons color="white" name="list-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    Thêm vào playlist
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons color="white" name="person-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    Xem tác giả
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={deleteHistory}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons color="red" name="trash-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "red",
                      marginLeft: 15,
                    }}
                  >
                    Xóa khỏi danh sách
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 10,
  },
  optionsWrapper: {},
  optionWrapper: {
    backgroundColor: "yellow",
    margin: 5,
  },
  optionTouchable: {
    underlayColor: "green",
    activeOpacity: 70,
  },
  optionText: {},
};
