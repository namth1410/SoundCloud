import AsyncStorage from "@react-native-async-storage/async-storage";

import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { getInfoAuthor } from "../redux/authorSlice";
import { PLAY_MODE, setPlayMode } from "../redux/configAudioSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { continuePlaySong, pauseSong, playSong } from "../redux/playSongSlice";
import { postSongPlaylistAsync } from "../redux/playlistDetailSlice";
import { addPlaylistAsync } from "../redux/playlistSlice";
import {
  addSongLike,
  addSongLikeAsync,
  deleteSongLike,
  deleteSongLikeAsync,
} from "../redux/songLikeSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import MySlider from "./MySlider";
import { addQueue, updateStorage } from "../redux/storageSlice";

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
  } = useAudio();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditPlaylistVisible, setModalEditPlaylistVisible] =
    useState(false);
  const [modalCreatePlaylistVisible, setModalCreatePlaylistVisible] =
    useState(false);
  const textInputRef = useRef(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [isDownloading, setIsDownloading] = useState("false");

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

  const previousSong = () => {
    let index = historyRedux.historyList.findIndex((element, index) => {
      return element.id === playSongStore.infoSong.id;
    });

    for (let i = 0; i < historyRedux.historyList.length; i++) {
      if (
        i > index &&
        historyRedux.historyList[i].id !== playSongStore.infoSong.id
      ) {
        index = i;
        break;
      }
    }
    playSound({ uri: historyRedux.historyList[index].linkSong });

    let newSuggestSongList = [
      playSongStore.infoSong,
      ...suggestSongRedux.suggestSongList,
    ];
    dispatch(updateDataSuggestSongList(newSuggestSongList));
    dispatch(playSong(historyRedux.historyList[index]));
  };

  const nextSong = () => {
    playSound({ uri: suggestSongRedux.suggestSongList[0].linkSong });
    dispatch(
      addHistoryAsync({
        ...suggestSongRedux.suggestSongList[0],
        token: userInfo.token,
      })
    );
    dispatch(playSong(suggestSongRedux.suggestSongList[0]));
    dispatch(
      updateDataSuggestSongList(suggestSongRedux.suggestSongList.slice(1))
    );
  };

  const addSongToPlaylist = async (item) => {
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
        setModalEditPlaylistVisible(false);
        ToastAndroid.show("Đã thêm vào playlist", ToastAndroid.SHORT);
      }
    });
  };

  const handleDownload = () => {
    if (isDownloading === "false") {
      dispatch(addQueue({ ...playSongStore.infoSong, progress: 0 }));
      downloadFromUrl(playSongStore.infoSong);
      ToastAndroid.show("Đang tải xuống", ToastAndroid.SHORT);
    } else if (isDownloading === "true") {
      console.log("xoa");
    }
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
            backgroundColor: "gray",
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
  }, []);

  useEffect(() => {
    if (showLottie) {
      lottieRef.current.play();
    }
  }, [showLottie]);

  useEffect(() => {
    if (isDownloading === "downloading" && modalVisible) {
      lottieDownloadingRef.current.play();
    }
  }, [isDownloading, modalVisible]);

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
      setIsDownloading("true");
    } else {
      setIsDownloading("false");
    }
    if (storageRedux.queue.length > 0) {
      const _queue = [...storageRedux.queue];
      const i = _queue.find((item) => item.id === playSongStore.infoSong.id);

      if (i) {
        setIsDownloading("downloading");
      }
    }
  }, [storageRedux]);

  useEffect(() => {
    setSliderValue(curTime);
  }, [curTime]);

  return (
    <SafeAreaView style={{ margin: 0, marginTop: 0, flex: 1 }}>
      <View
        style={{
          ...styles.centeredView,
          backgroundColor: "#E7CBCB",
        }}
      >
        <View
          style={{
            height: "80%",
            width: "100%",
            backgroundColor: "#E7CBCB",
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
                  source={require("../../assets/gai.jpg")}
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
          {/* <TouchableWithoutFeedback onPress={pausePlayAction}>
            <Image
              blurRadius={playing ? 0 : 2}
              style={{
                resizeMode: "cover",
                height: "100%",
                width: "100%",
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}
              source={require("../../assets/gai.jpg")}
            />
          </TouchableWithoutFeedback> */}

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
              <Ionicons name="heart" size={32} color="red" />
            ) : (
              <Ionicons name="heart-outline" size={32} color="black" />
            )}
          </TouchableOpacity>
          {/* <View style={{ flexWrap: "wrap", flex: 1, flexDirection: "column" }}>
            <Slider
              maximumValue={duration}
              minimumValue={0}
              minimumTrackTintColor="#307ecc"
              maximumTrackTintColor="#000000"
              step={1000}
              value={curTime}
              style={{ width: "100%" }}
              onValueChange={(curTime) => {
                setSliderValue(curTime);
              }}
              onSlidingComplete={(curTime) => {
                setPositionAudio(curTime);
              }}
            />
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.textLight, styles.timeStamp]}>
                {formatMillisecondsToTime(sliderValue)}
              </Text>
              <Text style={[styles.textLight, styles.timeStamp]}>
                {formatMillisecondsToTime(duration)}
              </Text>
            </View>
          </View> */}
          <MySlider></MySlider>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <Ionicons name="ellipsis-vertical-outline" size={32} color="#000" />
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
              <Ionicons name="shuffle" size={32} color="black" />
            ) : configAudio.playMode === PLAY_MODE.LOOP ? (
              <Ionicons name="repeat-outline" size={32} color="black" />
            ) : (
              <Ionicons
                name="return-up-forward-outline"
                size={32}
                color="black"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPressOut={() => {
              previousSong();
            }}
          >
            <Ionicons name="play-skip-back" size={32} color="#3D425C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButtonContainer}
            onPressIn={pausePlayAction}
          >
            {playing ? (
              <Ionicons name="pause-circle" size={60} color="#3D425C" />
            ) : (
              <Ionicons name="play" size={60} color="#3D425C" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPressOut={() => {
              nextSong();
            }}
          >
            <Ionicons name="play-skip-forward" size={32} color="#3D425C" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Suggest");
            }}
          >
            <Ionicons name="list-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={{
          opacity: opacity,
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
                  width: 0.7 * width,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontWeight: "bold", marginRight: 5 }}
                  >
                    {playSongStore.infoSong.nameSong}
                  </Text>
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
                onPress={() => {
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
                  <Ionicons color="black" name="create-outline" size={30} />
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
                  {isDownloading === "downloading" ? (
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
                  ) : isDownloading === "false" ? (
                    <Ionicons color="black" name="download-outline" size={30} />
                  ) : (
                    <Ionicons color="black" name="close-circle-outline" size={30} />
                  )}

                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "black",
                      marginLeft: 15,
                    }}
                  >
                    {isDownloading === "downloading"
                      ? "Đang tải xuống"
                      : isDownloading === "false"
                      ? "Tải xuống"
                      : "Xóa khỏi tải xuống"}
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

              <TouchableOpacity onPress={() => {}}>
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
                backgroundColor: "black",
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
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 0,
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
  coverContainer: {
    flex: 1,
    height: "100%",
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
