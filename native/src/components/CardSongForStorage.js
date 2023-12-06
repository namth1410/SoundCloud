import { useNavigation } from "@react-navigation/native";
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
  FlatList,
  TextInput,
  Animated,
  Easing,
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
import { addPlaylistAsync } from "../redux/playlistSlice";
import { postSongPlaylistAsync } from "../redux/playlistDetailSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
export default function CardSongForStorage({ props }) {
  const { id, img, nameAuthor } = props;
  const { width, height } = Dimensions.get("screen");
  const navigation = useNavigation();
  const { playSound, removeSongFromStorage } = useAudio();
  const songLikeRedux = useSelector((state) => state.songLikeRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const playlistRedux = useSelector((state) => state.playlistRedux);

  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditPlaylistVisible, setModalEditPlaylistVisible] =
    useState(false);
  const [modalCreatePlaylistVisible, setModalCreatePlaylistVisible] =
    useState(false);
  const [data, setData] = useState(playlistRedux.playlistList);
  const textInputRef = useRef(null);
  const [textInputValue, setTextInputValue] = useState("");
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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          addSongToPlaylist(item);
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 7,
            backgroundColor: "rgb(15,15,15)",
            marginBottom: 15,
            overflow: "visible",
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
            src={
              img === null || img === "" || img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: img }
            }
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
            src={
              img === null || img === "" || img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: img }
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
              {item.namePlaylist}
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
              {item.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          ></View>
        </View>
      </TouchableOpacity>
    );
  };

  const createNewPlaylist = async () => {
    if (textInputValue === "") {
      ToastAndroid.show("Không để trống", ToastAndroid.SHORT);
    } else {
      await dispatch(
        addPlaylistAsync({
          namePlaylist: textInputValue,
          access: isPublic ? "public" : "private",
          token: userInfo.token,
        })
      ).then((result) => {
        if (result.type.includes("rejected")) {
          if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
            ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
          }
        } else if (result.type.includes("fulfilled")) {
          toggleModal();
          ToastAndroid.show("Đã thêm mới", ToastAndroid.SHORT);
        }
      });
    }
  };

  const createNewPlaylistAndAddSong = async () => {
    if (textInputValue === "") {
      ToastAndroid.show("Không để trống", ToastAndroid.SHORT);
    } else {
      await dispatch(
        addPlaylistAsync({
          namePlaylist: textInputValue,
          access: "private",
          token: userInfoRedux.token,
        })
      ).then((result) => {
        if (result.type.includes("rejected")) {
          if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
            ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
          }
        } else if (result.type.includes("fulfilled")) {
          addSongToPlaylist(result.payload[result.payload.length - 1]);
          ToastAndroid.show("Đã thêm mới", ToastAndroid.SHORT);
          setModalCreatePlaylistVisible(false);
        }
      });
    }
  };

  const addSongToPlaylist = async (item) => {
    await dispatch(
      postSongPlaylistAsync({
        idPlaylist: item.id,
        idSong: props.id,
        token: userInfoRedux.token,
      })
    ).then((result) => {
      if (result.type.includes("rejected")) {
        if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
          ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
        }
      } else if (result.type.includes("fulfilled")) {
        setModalEditPlaylistVisible(false);
        ToastAndroid.show("Đã thêm vào playlist", ToastAndroid.SHORT);
      }
    });
  };

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

  const play = () => {
    playSound(props);
  };

  const addSongToQueue = () => {
    let newSuggestSongList = [...suggestSongRedux.suggestSongList];
    if (
      suggestSongRedux.suggestSongList.length === 0 &&
      Object.keys(playSongStore.infoSong).length === 0
    ) {
      play();
    } else {
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
    }
    setModalVisible(false);
  };

  const deleteSong = async () => {
    removeSongFromStorage(props);
  };

  useEffect(() => {
    if (songLikeRedux.songLikeList) {
      setIsLiked(songLikeRedux.songLikeList.some((item) => item.id === id));
    }
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingVertical: 5,
          paddingLeft: 10,
          marginBottom: 15,
          overflow: "visible",
          backgroundColor: "rgb(15,15,15)",
          borderRadius: 5,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPressOut={() => {
            play();
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
              img === null || img === "" || img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: img }
            }
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.56 * width,
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
        </TouchableOpacity>
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
              <Ionicons name="heart" color="#F57C1F" size={24} />
            ) : (
              <></>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggeleModal();
            }}
          >
            <Ionicons name="ellipsis-vertical" color="white" size={20} />
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
                source={
                  img === null || img === "" || img === "null"
                    ? require("../../assets/unknow.jpg")
                    : { uri: img }
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

              <TouchableOpacity
                onPress={() => {
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
                    <Ionicons name="heart" color="#F57C1F" size={30} />
                  ) : (
                    <Ionicons name="heart-outline" color="white" size={30} />
                  )}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    {isLiked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalEditPlaylistVisible(true);
                  setModalVisible(false);
                }}
              >
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

              <TouchableOpacity onPress={deleteSong}>
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
                    Xóa khỏi kho lưu trữ
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
      >
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalEditPlaylistVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                width: "100%",
                height: 0.6 * height,
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
              height: 0.7 * height,
              top: 0.3 * height + 20,
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
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Thêm bài hát vào playlist
              </Text>
            </View>

            <View
              style={{
                flexGrow: 1,
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 40,
                  marginVertical: 10,
                }}
              >
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 20, fontSize: 14 }}
                  placeholder="Tìm kiếm..."
                />
              </View>

              <View style={{ padding: 10, height: 0.5 * height }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalCreatePlaylistVisible(true);
                    setModalEditPlaylistVisible(false);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: "gray",
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 24, color: "white" }}>+</Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: "#000",
                      }}
                    >
                      Tạo playlist
                    </Text>
                  </View>
                </TouchableOpacity>

                <FlatList
                  data={data}
                  onDragEnd={({ data }) => setData(data)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  extraData={data}
                  style={{ paddingHorizontal: 0 }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* {playlistRedux.loading ? (
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
        ) : null} */}
      </Modal>

      <Modal
        transparent={true}
        visible={modalCreatePlaylistVisible}
        animationType="fade"
        onRequestClose={() => {
          setModalCreatePlaylistVisible(false);
          textInputRef.current.blur();
        }}
        onShow={() => {
          if (textInputRef.current) {
            textInputRef.current.focus();
          }
        }}
      >
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalCreatePlaylistVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                opacity: 0.5,
              }}
            ></View>
          </TouchableWithoutFeedback>
          <View
            {...panResponder.panHandlers}
            style={{
              width: "100%",
              height: 0.3 * height,
              top: 0.2 * height + 20,
              left: 0,
              position: "absolute",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#F8F0E5",
                borderRadius: 20,
                padding: 20,
                width: "90%",
                marginVertical: 5,
                overflow: "visible",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Tạo playlist
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "gray",
                  marginTop: 20,
                }}
              >
                <TextInput
                  ref={textInputRef}
                  style={{ height: 40, fontSize: 16 }}
                  placeholder="Nhập tên playlist"
                  placeholderTextColor="gray"
                  spellCheck={false}
                  onChangeText={(value) => {
                    setTextInputValue(value);
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalCreatePlaylistVisible(false);
                  }}
                >
                  <Text
                    style={{
                      padding: 7,
                      textAlign: "center",
                      backgroundColor: "gray",
                      color: "white",
                      borderRadius: 100,
                      width: 0.3 * width,
                      fontWeight: "bold",
                      fontSize: 16,
                      textTransform: "uppercase",
                      marginTop: 20,
                    }}
                  >
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    createNewPlaylistAndAddSong();
                  }}
                >
                  <Text
                    style={{
                      padding: 7,
                      textAlign: "center",
                      backgroundColor: "#F57C1F",
                      color: "white",
                      borderRadius: 100,
                      width: 0.3 * width,
                      fontWeight: "bold",
                      fontSize: 16,
                      textTransform: "uppercase",
                      marginTop: 20,
                    }}
                  >
                    Lưu
                  </Text>
                </TouchableOpacity>
              </View>
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
