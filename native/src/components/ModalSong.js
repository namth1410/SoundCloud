import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { hideModal } from "../redux/modalSlice";
import { continuePlaySong, pauseSong } from "../redux/playSongSlice";
import { useAudio } from "../common/AudioProvider";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  addSongLike,
  addSongLikeAsync,
  deleteSongLike,
  deleteSongLikeAsync,
} from "../redux/songSlice";
import Song from "../model/Song";
import { Dimensions } from "react-native";

export default function ModalSong() {
  const playSongStore = useSelector((state) => state.playSong);
  const userInfo = useSelector((state) => state.userInfo);
  const modalStore = useSelector((state) => state.modal);
  const allSongStore = useSelector((state) => state.allSong);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const { duration } = useAudio();
  const [sliderValue, setSliderValue] = useState("");
  const { width } = Dimensions.get("window");

  const likeSongAction = async () => {
    try {
      if (userInfo.token) {
        if (!isLiked) {
          setIsLiked(true);
          dispatch(
            addSongLike({
              id: playSongStore.id,
              nameSong: playSongStore.nameSong,
              nameAuthor: playSongStore.nameAuthor,
              linkSong: "",
              lyric: "",
              img: "",
            })
          );
          await dispatch(
            addSongLikeAsync({
              idSong: playSongStore.id,
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
        } else {
          setIsLiked(false);
          dispatch(
            deleteSongLike({
              id: playSongStore.id,
              nameSong: playSongStore.nameSong,
              nameAuthor: playSongStore.nameAuthor,
              linkSong: "",
              lyric: "",
              img: "",
            })
          );
          await dispatch(
            deleteSongLikeAsync({
              idSong: playSongStore.id,
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

  const pausePlayAction = () => {
    if (playSongStore.playing) {
      dispatch(pauseSong());
    } else {
      dispatch(continuePlaySong());
    }
  };

  function formatMillisecondsToTime(milliseconds) {
    // Chuyển milliseconds thành giây
    const seconds = Math.floor(milliseconds / 1000);
    // Tính số giờ, phút và giây
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Định dạng chuỗi thời gian theo định dạng hh:mm:ss
    const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;

    return formattedTime;
  }

  useEffect(() => {
    console.log("asds");
    console.log(modalStore.display);
    console.log(allSongStore.songLikeList);
    console.log(playSongStore);
    console.log(
      !!allSongStore.songLikeList.find((item) => item.id === playSongStore.id)
    );
    if (modalStore.display) {
      setIsLiked(
        !!allSongStore.songLikeList.find((item) => item.id === playSongStore.id)
      );
    }
  }, [playSongStore, modalStore.display]);
  useEffect(() => {
    setSliderValue(formatMillisecondsToTime(duration));
  }, [duration]);

  return (
    <Modal
      animationIn={"slideInUp"}
      animationType="slide"
      transparent={false}
      visible={modalStore.display}
      onRequestClose={() => {
        dispatch(hideModal());
      }}
      swipeDirection={["down"]}
      onSwipeComplete={() => {
        dispatch(hideModal());
      }}
      style={{ margin: 0, marginTop: 20 }}
    >
      <View style={{ ...styles.centeredView, backgroundColor: "yellow" }}>
        <View style={{ paddingTop: 20, paddingLeft: 32 }}>
          <Ionicons name="chevron-down-outline" size={32} color="gray" />
        </View>
        <View style={{ height: "50%", width: "100%" }}>
          <SwiperFlatList
            style={{
              backgroundColor: "green",
              display: "flex",
              height: 200,
              position: "relative",
            }}
            autoplay
            autoplayDelay={2}
            autoplayLoop
            index={0}
            showPagination
          >
            <View
              style={{
                ...styles.coverContainer,
                backgroundColor: "red",
                width: width,
              }}
            >
              {/* <Image
                source={require("../../assets/musique.jpg")}
                style={styles.cover}
              ></Image> */}
            </View>
            <View
              style={{
                ...styles.coverContainer,
                backgroundColor: "green",
                width: width,
              }}
            >
              {/* <Image
                source={require("../../assets/musique.jpg")}
                style={styles.cover}
              ></Image> */}
            </View>
          </SwiperFlatList>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 32,
            marginLeft: 32,
            marginRight: 32,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={likeSongAction}>
            {isLiked ? (
              <Ionicons name="heart" size={32} color="gray" />
            ) : (
              <Ionicons name="heart-outline" size={32} color="gray" />
            )}
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              width: 180,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.textDark, { fontSize: 14, fontWeight: "500" }]}
            >
              {playSongStore.nameSong}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.text, { fontSize: 12, marginTop: 8 }]}
            >
              {playSongStore.nameAuthor}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="download-outline" size={32} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ margin: 32 }}>
          <Slider
            maximumValue={100}
            minimumValue={0}
            minimumTrackTintColor="#307ecc"
            maximumTrackTintColor="#000000"
            step={1}
            // value={sliderValue}
            // onValueChange={(sliderValue) => setSliderValue(sliderValue)}
          />
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.textLight, styles.timeStamp]}>0</Text>
            <Text style={[styles.textLight, styles.timeStamp]}>
              {sliderValue}
            </Text>
          </View>
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
          <TouchableOpacity>
            <Ionicons name="shuffle" size={32} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="play-skip-back" size={32} color="#3D425C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButtonContainer}
            onPress={pausePlayAction}
          >
            {playSongStore.playing ? (
              <Ionicons name="pause-circle" size={60} color="#3D425C" />
            ) : (
              <Ionicons name="play" size={60} color="#3D425C" />
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="play-skip-forward" size={32} color="#3D425C" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={32} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
