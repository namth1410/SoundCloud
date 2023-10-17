import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";

export default function ControlSong() {
  const { playing, pauseSound, continuePlaySound } = useAudio();
  const navigation = useNavigation();
  const playSongStore = useSelector((state) => state.playSongRedux);
  const pauseAction = () => {
    if (playing) {
      pauseSound();
    } else {
      continuePlaySound();
    }
    // if (playSongStore.playing) {
    //   dispatch(pauseSong());
    // } else {
    //   dispatch(continuePlaySong());
    // }
  };

  const clickControlSong = () => {
    // dispatch(showModal());
    navigation.navigate("ModalSongV3");
  };

  const spinValue = new Animated.Value(0);

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => spin());
  };
  const spinAnimation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ ...styles.container }}
          onPress={clickControlSong}
        >
          <Animated.Image
            source={{
              uri: "http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg",
            }}
            style={{
              ...styles.albumCover,
              transform: [{ rotate: spinAnimation }],
            }}
          ></Animated.Image>
          <View style={styles.infoSongBox}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.nameSong}
            >
              {playSongStore.nameSong}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.authorSong}
            >
              {playSongStore.nameAuthor}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.controls}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity style={styles.control} onPressIn={pauseAction}>
              {playing ? (
                <Ionicons name="pause-outline" size={40} color="#fff" />
              ) : (
                <Ionicons name="play-outline" size={40} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={() => alert("")}>
              <Ionicons
                name="play-skip-forward-outline"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#3F3434",
    alignItems: "",
    position: "absolute",
    bottom: 49,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: "",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "contain",
    marginLeft: 15,
  },
  infoSongBox: {
    width: 160,
    justifyContent: "center",
    marginLeft: 15,
  },
  nameSong: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlignVertical: "bottom",
  },
  authorSong: {
    flex: 1,
    color: "#ccc",
    fontSize: 9,
  },
  controls: {
    justifyContent: "flex-end",
    marginRight: 10,
  },

  control: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
  },
});
