import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

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
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CardSongForPlaylist from "../components/CardSongForPlaylist";
import { putPlaylistAsync } from "../redux/playlistDetailSlice";
import { deletePlaylistAsync, getPlaylists } from "../redux/playlistSlice";
import { ScrollView } from "react-native-virtualized-view";
import { useAudio } from "../common/AudioProvider";

export default function PlaylistDetail({ route }) {
  const { width, height } = Dimensions.get("window");
  const { playRandomTrackList, playTrackList } = useAudio();
  const userInfo = useSelector((state) => state.userInfo);
  const playlistRedux = useSelector((state) => state.playlistRedux);
  const playlistDetailRedux = useSelector((state) => state.playlistDetailRedux);
  const [data, setData] = useState(playlistDetailRedux.playlistSongList);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [modalEditPlaylistVisible, setModalEditPlaylistVisible] =
    useState(false);
  const [filterSongs, setFilterSongs] = useState("new");
  const textInputRef = useRef(null);
  const [textInputValue, setTextInputValue] = useState("");
  let _namePlaylist = "";
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isPublic, setIsPublic] = useState(false);
  const [isPublicTemp, setIsPublicTemp] = useState(false);
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
        setModalVisible(false);
        setModalEditPlaylistVisible(false);
        setModalFilterVisible(false);
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
        namePlaylist: _namePlaylist,
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

  // useEffect(() => {
  //   let _playlistSongList = [...playlistDetailRedux.playlistSongList];
  //   _playlistSongList.sort((a, b) => b.id - a.id);
  //   setData(_playlistSongList);
  // }, [playlistDetailRedux.playlistSongList]);

  useEffect(() => {
    let _playlistSongList = [...playlistDetailRedux.playlistSongList];
    switch (filterSongs) {
      case "new":
        _playlistSongList.sort((a, b) => b.id - a.id);
        break;
      case "old":
        _playlistSongList.sort((a, b) => a.id - b.id);
        break;
      case "az":
        _playlistSongList.sort((a, b) => a.nameSong.localeCompare(b.nameSong));
        break;
      case "za":
        _playlistSongList.sort((a, b) => b.nameSong.localeCompare(a.nameSong));
        break;
      default:
    }

    setData(_playlistSongList);
  }, [filterSongs, playlistDetailRedux.playlistSongList]);

  const renderItem = ({ item }) => {
    return <CardSongForPlaylist props={{ ...item }}></CardSongForPlaylist>;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15,15,15)" }}>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            fontWeight: "bold",
            paddingBottom: 5,
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
            <Ionicons name="ellipsis-vertical" size={26} color="#F57C1F" />
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "red", width: width, height: width + 20 }}
        >
          <Image
            style={{
              resizeMode: "cover",
              width: width,
              height: width + 20,
            }}
            blurRadius={4}
            source={
              data.length === 0 || data[0].img === "" || data[0].img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: data[0].img }
            }
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(15, 15, 15, 1)"]}
            style={{
              ...StyleSheet.absoluteFillObject,
              position: "absolute",
              width: width,
              height: width + 20,
              top: 0,
              left: 0,
            }}
          />
          <Image
            style={{
              resizeMode: "cover",
              width: width * 0.6,
              height: width * 0.6,
              borderRadius: 10,
              position: "absolute",
              left: width * 0.2,
              top: 15,
            }}
            source={
              data.length === 0 || data[0].img === "" || data[0].img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: data[0].img }
            }
          />
          <View
            style={{
              width: width,
              position: "absolute",
              alignItems: "center",
              top: width * 0.6 + 20,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "white",
              }}
            >
              {playlistDetailRedux.namePlaylist}
            </Text>
          </View>

          <View
            style={{
              width: width,
              position: "absolute",
              top: width * 0.6 + 65,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginLeft: 20 }}>
              <View>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                >
                  Nam Trần
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#C7CCCF", fontSize: 12, marginRight: 10 }}
                >
                  {`${playlistDetailRedux.playlistSongList.length} Tracks`}
                </Text>
                {playlistDetailRedux.access === "public" ? (
                  <>
                    <Ionicons
                      name="earth-outline"
                      size={14}
                      color="#C7CCCF"
                    ></Ionicons>
                    <Text
                      style={{ color: "#C7CCCF", fontSize: 12, marginLeft: 2 }}
                    >
                      Công khai
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="lock-closed-outline"
                      size={14}
                      color="#C7CCCF"
                    ></Ionicons>
                    <Text
                      style={{ color: "#C7CCCF", fontSize: 12, marginLeft: 2 }}
                    >
                      Riêng tư
                    </Text>
                  </>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={{
                marginRight: 20,
              }}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={36}
                color="white"
              ></Ionicons>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width,
              position: "absolute",
              top: width - 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPressOut={() => {
                playTrackList(data);
              }}
              style={{
                width: 150,
                height: 35,
                backgroundColor: "white",
                borderRadius: 150,
                paddingVertical: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" color="black" size={26}></Ionicons>
              <Text
                style={{
                  color: "black",
                  marginLeft: 8,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Phát tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={() => {
                playRandomTrackList(playlistDetailRedux.playlistSongList);
              }}
              style={{
                width: 150,
                height: 35,
                backgroundColor: "#393D3E",
                borderRadius: 150,
                paddingVertical: 2,
                paddingHorizontal: 25,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shuffle-outline"
                color="white"
                size={26}
              ></Ionicons>
              <Text
                style={{
                  color: "white",
                  marginLeft: 8,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Trộn bài
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgb(15,15,15)",
            padding: 10,
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            onPressOut={() => {
              setModalVisible(false);
              setModalEditPlaylistVisible(false);
              setModalFilterVisible(true);
            }}
            style={{
              marginLeft: 5,
              flexDirection: "row",
              marginBottom: 15,
              width: 210,
            }}
          >
            <Ionicons name="filter-outline" size={26} color="#ABABAB" />
            <Text style={{ color: "#ABABAB", marginLeft: 8 }}>
              {filterSongs === "new"
                ? "Ngày thêm (mới nhất)"
                : filterSongs === "old"
                ? "Ngày thêm (cũ nhất)"
                : filterSongs === "az"
                ? "Tên track (A-Z)"
                : "Tên track (Z-A)"}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={data}
            // onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ paddingHorizontal: 0 }}
          />
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
                  height: 0.7 * height + 20,
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
                height: 0.3 * height,
                top: 0.7 * height + 20,
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
                    width: 65,
                    height: 65,
                    borderRadius: 5,
                    zIndex: 2,
                  }}
                  source={
                    data.length === 0 ||
                    data[0].img === "" ||
                    data[0].img === "null"
                      ? require("../../assets/unknow.jpg")
                      : { uri: data[0].img }
                  }
                />
                <Image
                  blurRadius={10}
                  style={{
                    resizeMode: "cover",
                    width: 65,
                    height: 65,
                    borderRadius: 5,
                    position: "absolute",
                    top: 10,
                    left: 5,
                  }}
                  source={
                    data.length === 0 ||
                    data[0].img === "" ||
                    data[0].img === "null"
                      ? require("../../assets/gai.jpg")
                      : { uri: data[0].img }
                  }
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
                      style={{
                        fontWeight: "bold",
                        marginRight: 5,
                        color: "white",
                        fontSize: 18,
                      }}
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
                      color: "#A3A1A2",
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
                    <Ionicons color="white" name="create-outline" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "white",
                        marginLeft: 15,
                      }}
                    >
                      Chỉnh sửa
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    deletePlaylist();
                    setModalVisible(false);
                    setModalEditPlaylistVisible(false);
                    setModalFilterVisible(false);
                  }}
                >
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
                  backgroundColor: "#1A1A1A",
                  width: "90%",
                  height: 0.3 * height,
                  top: 0.25 * height,
                  left: 0.05 * width,
                  opacity: 1,
                  borderRadius: 5,
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
                  <Ionicons color="#F57C1F" name="close-outline" size={40} />
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
                      color: "#868686",
                      width: 120,
                    }}
                  >
                    Tên playlist
                  </Text>
                  <View
                    style={{ borderBottomWidth: 1, borderColor: "#868686" }}
                  >
                    <TextInput
                      ref={textInputRef}
                      style={{ height: 40, fontSize: 16, color: "white" }}
                      placeholder="Nhập tên playlist"
                      placeholderTextColor="white"
                      spellCheck={false}
                      onChangeText={(value) => {
                        // setTextInputValue(value);
                        _namePlaylist = value;
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
                    <Text style={{ flex: 1, fontSize: 16, color: "#868686" }}>
                      Công khai
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Switch
                        value={isPublicTemp}
                        onValueChange={(newValue) => {
                          setIsPublicTemp(newValue);
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

        <Modal
          transparent={true}
          visible={modalFilterVisible}
          animationType="slide"
          onRequestClose={() => {
            setModalFilterVisible(false);
          }}
        >
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalFilterVisible(false);
              }}
            >
              <View
                style={{
                  backgroundColor: "black",
                  width: "100%",
                  height: 0.6 * height + 20,
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
                height: 0.4 * height,
                top: 0.6 * height + 20,
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
              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-start",
                  marginHorizontal: 20,
                  marginVertical: 10,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Sắp xếp theo
              </Text>
              <View
                style={{
                  flexGrow: 1,
                  width: "100%",
                  paddingHorizontal: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalFilterVisible(false);
                    setFilterSongs("new");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons color="white" name="caret-up" size={30} />
                      <Text
                        style={{
                          fontSize: 15,
                          color: "white",
                          marginLeft: 15,
                        }}
                      >
                        Ngày thêm (mới nhất)
                      </Text>
                    </View>
                    <Ionicons
                      color="#F57C1F"
                      size={26}
                      name="checkmark"
                      style={{
                        display: filterSongs === "new" ? "flex" : "none",
                      }}
                    ></Ionicons>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalFilterVisible(false);
                    setFilterSongs("old");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons color="white" name="caret-down" size={30} />
                      <Text
                        style={{
                          fontSize: 15,
                          color: "white",
                          marginLeft: 15,
                        }}
                      >
                        Ngày thêm (cũ nhất)
                      </Text>
                    </View>
                    <Ionicons
                      color="#F57C1F"
                      size={26}
                      name="checkmark"
                      style={{
                        display: filterSongs === "old" ? "flex" : "none",
                      }}
                    ></Ionicons>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalFilterVisible(false);
                    setFilterSongs("az");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons color="white" name="caret-down" size={30} />
                      <Text
                        style={{
                          fontSize: 15,
                          color: "white",
                          marginLeft: 15,
                        }}
                      >
                        Tên track(A-Z)
                      </Text>
                    </View>
                    <Ionicons
                      color="#F57C1F"
                      size={26}
                      name="checkmark"
                      style={{
                        display: filterSongs === "az" ? "flex" : "none",
                      }}
                    ></Ionicons>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalFilterVisible(false);
                    setFilterSongs("za");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons color="white" name="caret-down" size={30} />
                      <Text
                        style={{
                          fontSize: 15,
                          color: "white",
                          marginLeft: 15,
                        }}
                      >
                        Tên track(Z-A)
                      </Text>
                    </View>
                    <Ionicons
                      color="#F57C1F"
                      size={26}
                      name="checkmark"
                      style={{
                        display: filterSongs === "za" ? "flex" : "none",
                      }}
                    ></Ionicons>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
