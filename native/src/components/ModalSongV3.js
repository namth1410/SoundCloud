import AsyncStorage from "@react-native-async-storage/async-storage";

import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { getInfoAuthor } from "../redux/authorSlice";
import { PLAY_MODE, setPlayMode } from "../redux/configAudioSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { continuePlaySong, pauseSong, playSong } from "../redux/playSongSlice";
import {
  deleteSongPlaylistAsync,
  postSongPlaylistAsync,
} from "../redux/playlistDetailSlice";
import { addPlaylistAsync, getPlaylists } from "../redux/playlistSlice";
import {
  addSongLike,
  addSongLikeAsync,
  deleteSongLike,
  deleteSongLikeAsync,
} from "../redux/songLikeSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import MySlider from "./MySlider";
import { addQueue, updateStorage } from "../redux/storageSlice";
import {
  convertNumberToString,
  convertTimeToString,
} from "../ultis/FunctionHelper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ModalSongV3({ navigation }) {
  const playSongStore = useSelector((state) => state.playSongRedux);
  const userInfo = useSelector((state) => state.userInfo);
  const songLikeRedux = useSelector((state) => state.songLikeRedux);
  const playlistRedux = useSelector((state) => state.playlistRedux);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const historyRedux = useSelector((state) => state.historyRedux);
  const storageRedux = useSelector((state) => state.storageRedux);

  const configAudio = useSelector((state) => state.configAudio);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const lottieRef = useRef(null);
  const [data, setData] = useState(playlistRedux.playlistList);
  const {
    playing,
    curTime,
    pauseSound,
    continuePlaySound,
    playSound,
    downloadFromUrl,
    playNextTrack,
    playPreTrack,
  } = useAudio();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditPlaylistVisible, setModalEditPlaylistVisible] =
    useState(false);
  const [modalCreatePlaylistVisible, setModalCreatePlaylistVisible] =
    useState(false);
  const textInputRef = useRef(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [isDownloaded, setIsDownloaded] = useState("false");

  const [sliderValue, setSliderValue] = useState(10);
  const doubleTapRef = useRef(null);
  const [showLottie, setShowLottie] = useState(false);
  const { width, height } = Dimensions.get("window");
  const value = new Animated.Value(0);

  const lottieDownloadingRef = useRef(null);

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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAnimationFinish = () => {
    setShowLottie(false);
  };

  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
    }
  };

  const onDoubleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      likeSongAction();
    }
  };

  const addSongToPlaylist = async (item) => {
    if (item.idSongList.includes(playSongStore.infoSong.id)) {
      await dispatch(
        deleteSongPlaylistAsync({
          idPlaylist: item.id,
          idSong: playSongStore.infoSong.id,
          token: userInfo.token,
        })
      ).then((result) => {
        if (result.type.includes("rejected")) {
          if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
            ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
          }
        } else if (result.type.includes("fulfilled")) {
          dispatch(getPlaylists({ token: userInfo.token }));
          // setModalEditPlaylistVisible(false);
          ToastAndroid.show(
            `Đã xóa khỏi playlist ${item.namePlaylist}`,
            ToastAndroid.SHORT
          );
        }
      });
    } else {
      await dispatch(
        postSongPlaylistAsync({
          idPlaylist: item.id,
          idSong: playSongStore.infoSong.id,
          token: userInfo.token,
        })
      ).then((result) => {
        if (result.type.includes("rejected")) {
          if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
            ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
          }
        } else if (result.type.includes("fulfilled")) {
          dispatch(getPlaylists({ token: userInfo.token }));
          // setModalEditPlaylistVisible(false);
          ToastAndroid.show(
            `Đã thêm vào playlist ${item.namePlaylist}`,
            ToastAndroid.SHORT
          );
        }
      });
    }
  };

  const handleDownload = () => {
    if (isDownloaded === "false") {
      dispatch(addQueue({ ...playSongStore.infoSong, progress: 0 }));
      downloadFromUrl(playSongStore.infoSong);
      ToastAndroid.show("Đang tải xuống", ToastAndroid.SHORT);
    } else if (isDownloaded === "true") {
      let _storage = [...storageRedux.storage];
      _storage = _storage.filter(
        (item) => item.id !== playSongStore.infoSong.id
      );
      AsyncStorage.setItem("downloadedSongs", JSON.stringify(_storage)).then(
        () => {
          dispatch(updateStorage(_storage));
          ToastAndroid.show("Đã xóa khỏi tải xuống", ToastAndroid.SHORT);
        }
      );
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        delayPressIn={1000}
        onPressOut={() => {
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
              width: 65,
              height: 65,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={
              item.imgFirstSong === null ||
              item.imgFirstSong === "" ||
              item.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: item.imgFirstSong }
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
              top: 12,
              left: 5,
            }}
            source={
              item.imgFirstSong === null ||
              item.imgFirstSong === "" ||
              item.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: item.imgFirstSong }
            }
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.55 * width,
              justifyContent: "center",
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {item.namePlaylist}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 2,
                  color: "#A3A1A2",
                  fontSize: 12,
                }}
              >
                {`${item.numberTrack} Tracks`}
              </Text>
              <Icon
                style={{ marginHorizontal: 7 }}
                name="circle"
                size={4}
                color="#A3A1A2"
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 2,
                  color: "#A3A1A2",
                  fontSize: 12,
                }}
              >
                {convertTimeToString(item.createdAt)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              flexGrow: 1,
            }}
          >
            {item.idSongList.includes(playSongStore.infoSong.id) ? (
              <Ionicons
                name="checkmark-circle"
                size={26}
                color="#F57C1F"
              ></Ionicons>
            ) : (
              <></>
            )}
          </View>
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
          token: userInfo.token,
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

  const likeSongAction = async () => {
    try {
      if (userInfo.token) {
        if (!isLiked) {
          setIsLiked(true);
          dispatch(addSongLike(playSongStore.infoSong));
          await dispatch(
            addSongLikeAsync({
              idSong: playSongStore.infoSong.id,
              token: userInfo.token,
            })
          )
            .then(() => {})
            .catch((error) => {
              console.error(
                "Action addSongLike bị từ chối hoặc gặp lỗi:",
                error
              );
              setIsLiked(false);
            });
          setShowLottie(true);
        } else {
          setIsLiked(false);
          dispatch(deleteSongLike(playSongStore.infoSong));
          await dispatch(
            deleteSongLikeAsync({
              idSong: playSongStore.infoSong.id,
              token: userInfo.token,
            })
          )
            .then(() => {})
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

  const togglePlayMode = () => {
    if (configAudio.playMode === PLAY_MODE.SEQUENCE) {
      dispatch(setPlayMode(PLAY_MODE.RANDOM));
    } else if (configAudio.playMode === PLAY_MODE.RANDOM) {
      dispatch(setPlayMode(PLAY_MODE.LOOP));
    } else {
      dispatch(setPlayMode(PLAY_MODE.SEQUENCE));
    }
  };

  const pausePlayAction = () => {
    if (playing) {
      pauseSound();
      dispatch(pauseSong());
    } else {
      dispatch(continuePlaySong());
      continuePlaySound();
    }
  };

  useEffect(() => {
    setIsLiked(
      !!songLikeRedux.songLikeList.find(
        (item) => item.id === playSongStore.infoSong.id
      )
    );
    if (
      !!storageRedux.storage.find(
        (item) => item.id === playSongStore.infoSong.id
      )
    ) {
      setIsDownloaded("true");
    } else {
      setIsDownloaded("false");
    }
  }, []);

  useEffect(() => {
    if (
      !!storageRedux.storage.find(
        (item) => item.id === playSongStore.infoSong.id
      )
    ) {
      setIsDownloaded("true");
    } else {
      setIsDownloaded("false");
    }
  }, [storageRedux]);

  useEffect(() => {
    if (showLottie) {
      lottieRef.current.play();
    }
  }, [showLottie]);

  useEffect(() => {
    if (isDownloaded === "downloading" && modalVisible) {
      lottieDownloadingRef.current.play();
    }
  }, [isDownloaded, modalVisible]);

  useEffect(() => {
    setData(playlistRedux.playlistList);
  }, [playlistRedux]);

  useEffect(() => {
    if (
      modalVisible ||
      modalCreatePlaylistVisible ||
      modalEditPlaylistVisible
    ) {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, modalCreatePlaylistVisible, modalEditPlaylistVisible]);

  useEffect(() => {
    const _storage = [...storageRedux.storage];
    const i = _storage.find((item) => item.id === playSongStore.infoSong.id);

    if (i) {
      setIsDownloaded("true");
    } else {
      setIsDownloaded("false");
    }
    if (storageRedux.queue.length > 0) {
      const _queue = [...storageRedux.queue];
      const i = _queue.find((item) => item.id === playSongStore.infoSong.id);

      if (i) {
        setIsDownloaded("downloading");
      }
    }
  }, [storageRedux]);

  useEffect(() => {
    setSliderValue(curTime);
  }, [curTime]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgb(15,15,15)",
        }}
      >
        <View
          style={{
            height: "80%",
            width: "100%",
            backgroundColor: "rgb(15,15,15)",
          }}
          onTouchStart={(e) => (this.touchY = e.nativeEvent.pageY)}
          onTouchEnd={(e) => {
            if (e.nativeEvent.pageY - this.touchY > 20)
              console.log("Swiped down");
            // navigation.goBack();
          }}
        >
          <TapGestureHandler
            onHandlerStateChange={onSingleTapEvent}
            waitFor={doubleTapRef}
          >
            <TapGestureHandler
              ref={doubleTapRef}
              onHandlerStateChange={onDoubleTapEvent}
              numberOfTaps={2}
            >
              <View style={{ height: "100%", width: "100%" }}>
                <Image
                  blurRadius={playing ? 0 : 2}
                  style={{
                    resizeMode: "cover",
                    height: "100%",
                    width: "100%",
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                  }}
                  source={
                    playSongStore.infoSong.img === null ||
                    playSongStore.infoSong.img === "" ||
                    playSongStore.infoSong.img === "null"
                      ? require("../../assets/unknow.jpg")
                      : { uri: playSongStore.infoSong.img }
                  }
                />
                {showLottie && (
                  <LottieView
                    style={{
                      width: "100%",
                      height: 200,
                      position: "absolute",
                      top: 100,
                      transform: [{ scale: 1.3 }],
                    }}
                    ref={lottieRef}
                    source={require("../../assets/heart.json")}
                    renderMode={"SOFTWARE"}
                    loop={false}
                    onAnimationFinish={handleAnimationFinish}
                  />
                )}
              </View>
            </TapGestureHandler>
          </TapGestureHandler>

          <View
            style={{
              width: 280,
              top: 10,
              left: 10,
              position: "absolute",
            }}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                styles.textDark,
                {
                  fontSize: 22,
                  fontWeight: "500",
                  backgroundColor: "black",
                  color: "white",
                  alignSelf: "flex-start",
                },
              ]}
            >
              {playSongStore.infoSong.nameSong}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  getInfoAuthor({ idUser: playSongStore.infoSong.idUser })
                );
                navigation.navigate("Author");
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.text,
                  {
                    fontSize: 18,
                    marginTop: 8,
                    backgroundColor: "black",
                    alignSelf: "flex-start",
                  },
                ]}
              >
                {playSongStore.infoSong.nameAuthor}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              borderRadius: 100,
              right: 10,
              top: 10,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="chevron-down-outline" size={32} color="black" />
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginLeft: 32,
            marginRight: 32,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              likeSongAction();
            }}
          >
            {isLiked ? (
              <Ionicons name="heart" size={32} color="pink" />
            ) : (
              <Ionicons name="heart-outline" size={32} color="white" />
            )}
          </TouchableOpacity>

          <MySlider></MySlider>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: 32,
            marginRight: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              togglePlayMode();
            }}
          >
            {configAudio.playMode === PLAY_MODE.RANDOM ? (
              <Ionicons name="shuffle" size={32} color="#A3A1A2" />
            ) : configAudio.playMode === PLAY_MODE.LOOP ? (
              <Ionicons name="repeat-outline" size={32} color="#A3A1A2" />
            ) : (
              <Ionicons
                name="return-up-forward-outline"
                size={32}
                color="#A3A1A2"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPressOut={() => {
              playPreTrack();
            }}
          >
            <Ionicons name="play-skip-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButtonContainer}
            onPressIn={pausePlayAction}
          >
            {playing ? (
              <Ionicons name="pause-circle" size={60} color="white" />
            ) : (
              <Ionicons name="play" size={60} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPressOut={() => {
              playNextTrack();
            }}
          >
            <Ionicons name="play-skip-forward" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Suggest");
            }}
          >
            <Ionicons name="list-outline" size={32} color="#A3A1A2" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={{
          // opacity: opacity,
          opacity: 0.6,
          backgroundColor: "#000",
          width: width,
          height: height,
          position: "absolute",
          display:
            modalVisible ||
            modalCreatePlaylistVisible ||
            modalEditPlaylistVisible
              ? "flex"
              : "none",
        }}
      ></Animated.View>

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
              backgroundColor: "rgb(15,15,15)",
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
                  playSongStore.infoSong.img === null ||
                  playSongStore.infoSong.img === "" ||
                  playSongStore.infoSong.img === "null"
                    ? require("../../assets/unknow.jpg")
                    : { uri: playSongStore.infoSong.img }
                }
              />

              <View
                style={{
                  flexDirection: "column",
                  marginLeft: 15,
                  width: 0.7 * width,
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
                    }}
                  >
                    {playSongStore.infoSong.nameSong}
                  </Text>
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
                  {playSongStore.infoSong.nameAuthor}
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
                delayPressIn={1000}
                onPressOut={() => {
                  setModalEditPlaylistVisible(true);
                  setModalVisible(false);
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
                    Thêm vào playlist
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                delayPressIn={1000}
                onPressOut={() => {
                  handleDownload();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  {isDownloaded === "downloading" ? (
                    <LottieView
                      style={{
                        width: 30,
                        height: 30,
                        transform: [{ scale: 1.3 }],
                      }}
                      ref={lottieDownloadingRef}
                      source={require("../../assets/loading.json")}
                      renderMode={"SOFTWARE"}
                      loop={true}
                    />
                  ) : isDownloaded === "false" ? (
                    <Ionicons color="white" name="download-outline" size={30} />
                  ) : (
                    <Ionicons
                      color="white"
                      name="close-circle-outline"
                      size={30}
                    />
                  )}

                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "white",
                      marginLeft: 15,
                    }}
                  >
                    {isDownloaded === "downloading"
                      ? "Đang tải xuống"
                      : isDownloaded === "false"
                      ? "Tải xuống"
                      : "Xóa khỏi tải xuống"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                delayPressIn={1000}
                onPressOut={() => {
                  dispatch(
                    getInfoAuthor({ idUser: playSongStore.infoSong.idUser })
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

              <TouchableOpacity onPress={() => {}}>
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
      >
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalEditPlaylistVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "white",
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
              backgroundColor: "rgb(15,15,15)",
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
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "#F57C1F" }}
              >
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
                  style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    fontSize: 14,
                    color: "white",
                  }}
                  placeholder="Tìm kiếm..."
                  placeholderTextColor="white"
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
                        width: 65,
                        height: 65,
                        backgroundColor: "rgb(50,50,50)",
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 24, color: "#9D9F9E" }}>+</Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: "white",
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
        animationType="slide"
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
                backgroundColor: "white",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                opacity: 0,
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
                backgroundColor: "rgb(15,15,15)",
                borderRadius: 20,
                padding: 20,
                width: "90%",
                marginVertical: 5,
                overflow: "visible",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "#F57C1F" }}
              >
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
                  style={{ height: 40, fontSize: 16, color: "white" }}
                  placeholder="Nhập tên playlist"
                  placeholderTextColor="#A3A1A2"
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

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "red",
  },
  slide1: {
    width: 300,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },

  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textLight: {
    color: "#B6B7BF",
  },
  text: {
    color: "#8E97A6",
  },
  textDark: {
    color: "#3D425C",
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF",
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C",
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  playButtonContainer: {
    // backgroundColor: "#FFF",
    // borderColor: "rgba(93, 63, 106, 0.2)",
    // borderWidth: 16,
    // width: 100,
    // height: 100,
    // borderRadius: 64,
    // alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: 32,
    // shadowColor: "#5D3F6A",
    // shadowRadius: 30,
    // shadowOpacity: 0.5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 10,
  },
  optionsWrapper: {},
  optionWrapper: {
    backgroundColor: "#E7CBCB",
    margin: 5,
  },
  optionTouchable: {
    underlayColor: "green",
    activeOpacity: 70,
  },
  optionText: {},
};
