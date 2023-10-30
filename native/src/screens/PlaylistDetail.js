import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  PanResponder,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CardSongForPlaylist from "../components/CardSongForPlaylist";
import { putPlaylistAsync } from "../redux/playlistDetailSlice";
import { deletePlaylistAsync, getPlaylists } from "../redux/playlistSlice";

export default function PlaylistDetail({ route }) {
  const { width, height } = Dimensions.get("window");
  const userInfo = useSelector((state) => state.userInfo);
  const playlistRedux = useSelector((state) => state.playlistRedux);
  const playlistDetailRedux = useSelector((state) => state.playlistDetailRedux);
  const [data, setData] = useState(playlistDetailRedux.playlistSongList);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditPlaylistVisible, setModalEditPlaylistVisible] =
    useState(false);
  const textInputRef = useRef(null);
  const [textInputValue, setTextInputValue] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isPublic, setIsPublic] = useState(false);
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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const deletePlaylist = async () => {
    await dispatch(
      deletePlaylistAsync({
        idPlaylist: playlistDetailRedux.idPlaylist,
        token: userInfo.token,
      })
    ).then((result) => {
      if (result.type.includes("rejected")) {
        if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
          ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
        }
      } else if (result.type.includes("fulfilled")) {
        toggleModal();
        ToastAndroid.show(
          `Đã xóa playlist ${playlistDetailRedux.namePlaylist}`,
          ToastAndroid.SHORT
        );
        navigation.goBack();
      }
    });
  };

  const saveChangePlaylist = async () => {
    await dispatch(
      putPlaylistAsync({
        idPlaylist: playlistDetailRedux.idPlaylist,
        access: isPublic ? "public" : "private",
        namePlaylist: textInputValue,
        token: userInfo.token,
      })
    ).then((result) => {
      if (result.type.includes("rejected")) {
        if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
          ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
        }
      } else if (result.type.includes("fulfilled")) {
        dispatch(getPlaylists({ token: userInfo.token }));
        setModalEditPlaylistVisible(false);
        ToastAndroid.show(
          `Đã cập nhật playlist ${playlistDetailRedux.namePlaylist}`,
          ToastAndroid.SHORT
        );
        toggleModal();
        // navigation.goBack();
      }
    });
  };

  useEffect(() => {
    setData(playlistDetailRedux.playlistSongList);
  }, [playlistDetailRedux.playlistSongList]);

  const renderItem = ({ item }) => {
    return <CardSongForPlaylist props={{ ...item }}></CardSongForPlaylist>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#132043",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
        <View
          style={{
            fontWeight: "bold",
            paddingBottom: 12,
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back-outline" size={36} color="#F57C1F" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <Ionicons
              name="ellipsis-vertical-outline"
              size={28}
              color="#F57C1F"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            marginHorizontal: 15,
            marginBottom: 15,
            overflow: "visible",
            borderRadius: 5,
          }}
        >
          <Image
            style={{
              resizeMode: "cover",
              width: 100,
              height: 100,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={require("../../assets/gai.jpg")}
          />

          <Image
            blurRadius={10}
            style={{
              resizeMode: "cover",
              width: 100,
              height: 100,
              borderRadius: 5,
              position: "absolute",
              top: 16,
              left: 6,
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
              style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
            >
              {playlistDetailRedux.namePlaylist}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                marginTop: 2,
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: 12,
              }}
            >
              tran nam
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                marginTop: 2,
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: 12,
              }}
            >
              3 bài hát | 2 tiếng 15 phút
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginRight: 5,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 12,
                }}
              >
                {playlistDetailRedux.access === "public"
                  ? "Công khai"
                  : "Riêng tư"}
              </Text>
              {playlistDetailRedux.access === "public" ? (
                <Ionicons color="white" name="earth" size={14} />
              ) : (
                <Ionicons color="white" name="lock-closed" size={14} />
              )}
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity>
            <Text
              style={{
                padding: 5,
                textAlign: "center",
                backgroundColor: "#F57C1F",
                color: "white",
                borderRadius: 100,
                width: 0.6 * width,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Phát ngẫu nhiên
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "yellow", padding: 10 }}>
          <FlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
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
              <Image
                blurRadius={10}
                style={{
                  resizeMode: "cover",
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  position: "absolute",
                  top: 10,
                  left: 5,
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontWeight: "bold", marginRight: 5 }}
                  >
                    {playlistDetailRedux.namePlaylist}
                  </Text>
                  {playlistDetailRedux.access === "public" ? (
                    <Ionicons color="orange" name="earth" size={16} />
                  ) : (
                    <Ionicons color="orange" name="lock-closed" size={14} />
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    marginTop: 2,
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: 12,
                  }}
                >
                  Trần Nam
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
              <TouchableOpacity
                onPress={() => {
                  setModalEditPlaylistVisible(true);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 5,
                  }}
                >
                  <Ionicons color="black" name="create-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Chỉnh sửa
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
                  <Ionicons color="black" name="download-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Tải xuống playlist
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

              <TouchableOpacity>
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

              <TouchableOpacity
                onPress={() => {
                  deletePlaylist();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Ionicons color="black" name="trash-outline" size={30} />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    Xóa playlist
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalEditPlaylistVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalEditPlaylistVisible(false);
        }}
        onShow={() => {
          setIsPublic(playlistDetailRedux.access === "public" ? true : false);
          setTextInputValue(playlistDetailRedux.namePlaylist);
          textInputRef.current.setNativeProps({
            text: `${playlistDetailRedux.namePlaylist}`,
          });
          textInputRef.current.focus();
          Keyboard.isVisible();
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          accessible={false}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            <View
              style={{
                backgroundColor: "grey",
                width: "90%",
                height: 0.3 * height,
                top: 0.25 * height,
                left: 0.05 * width,
                opacity: 1,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 5,
                  top: 5,
                }}
                onPress={() => {
                  setModalEditPlaylistVisible(false);
                }}
              >
                <Ionicons color="black" name="close-circle-outline" size={40} />
              </TouchableOpacity>

              <View
                style={{
                  margin: 20,
                  marginTop: 15,
                  marginRight: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.5)",
                    width: 120,
                  }}
                >
                  Tên playlist
                </Text>
                <View style={{ borderBottomWidth: 1, borderColor: "black" }}>
                  <TextInput
                    ref={textInputRef}
                    style={{ height: 40, fontSize: 16 }}
                    placeholder="Nhập tên playlist"
                    placeholderTextColor="black"
                    spellCheck={false}
                    onChangeText={(value) => {
                      setTextInputValue(value);
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 16 }}>Công khai</Text>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Switch
                      value={isPublic}
                      onValueChange={(newValue) => {
                        setIsPublic(newValue);
                      }}
                      trackColor={{ false: "white", true: "#F57C1F" }}
                      thumbColor={
                        playlistDetailRedux.access === "public"
                          ? "white"
                          : "#333"
                      }
                    />
                  </View>
                </View>

                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => {
                      saveChangePlaylist();
                    }}
                  >
                    <Text
                      style={{
                        padding: 5,
                        textAlign: "center",
                        backgroundColor: "#F57C1F",
                        color: "white",
                        borderRadius: 100,
                        width: 0.6 * width,
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      Lưu thay đổi
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {playlistRedux.loading ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#F57C1F" />
          </View>
        ) : null}
      </Modal>
    </SafeAreaView>
  );
}
