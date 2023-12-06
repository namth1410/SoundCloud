import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAudio } from "../common/AudioProvider";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import { useDispatch, useSelector } from "react-redux";
export default function ControlSong() {
  const { playing, pauseSound, continuePlaySound, playSound, playNextTrack } =
    useAudio();
  const navigation = useNavigation();
  const playSongStore = useSelector((state) => state.playSongRedux);
  const userInfo = useSelector((state) => state.userInfo);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const dispatch = useDispatch();
  const pauseAction = () => {
    if (playing) {
      pauseSound();
    } else {
      continuePlaySound();
    }
  };

  const clickControlSong = () => {
    navigation.navigate("ModalSongV3");
  };

  const spinValue = new Animated.Value(0);

  const spin = () => {
    spinValue.setValue(spinValue._value % 1);
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

  useEffect(() => {
    if (playing) {
      spin();
    }
  }, [playing]);
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ ...styles.container }}
          onPress={clickControlSong}
        >
          <Animated.Image
            src={
              playSongStore.infoSong.img ?? require("../../assets/musique.jpg")
            }
            style={{
              ...styles.albumCover,
              transform: [{ rotate: spinAnimation }],
            }}
          ></Animated.Image>
          <View style={styles.infoSongBox}>
            {/* <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.nameSong}
            >
              {playSongStore.infoSong.nameSong}
            </Text> */}
            <MarqueeLabel text={playSongStore.infoSong.nameSong} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.authorSong}
            >
              {playSongStore.infoSong.nameAuthor}
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
            <TouchableOpacity
              style={styles.control}
              onPress={() => playNextTrack()}
            >
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
    backgroundColor: "#2C3333",
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

const MarqueeLabel = ({ text }) => {
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (textWidth > containerWidth) {
      const animation = Animated.timing(animatedValue, {
        toValue: -(textWidth - containerWidth),
        duration: 8000, // Adjust the duration as needed
        useNativeDriver: false,
      });

      Animated.loop(animation).start();
    }
  }, [textWidth, containerWidth]);

  const handleTextLayout = (event) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const handleContainerLayout = (event) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={{ overflow: "hidden", flexDirection: "row" }}
      onLayout={handleContainerLayout}
    >
      <Animated.View
        style={{
          transform: [{ translateX: animatedValue }],
          flexDirection: "row",
        }}
      >
        <Text
          onLayout={handleTextLayout}
          numberOfLines={1}
          style={{
            width: "auto",
            fontWeight: "bold",
            color: "#fff",
            textAlignVertical: "bottom",
          }}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};
