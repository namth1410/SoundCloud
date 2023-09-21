import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";

import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { pauseSong, continuePlaySong } from "../redux/playSongSlice";
import ModalSong from "../components/ModalSong";

export default function DetailSong() {
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(15);

  const pauseAction = () => {
    if (playSongStore.playing) {
      dispatch(pauseSong());
      // pauseSound();
    } else {

      dispatch(continuePlaySong());
      // continuePlaySound();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <Text style={[styles.textLight, { fontSize: 12 }]}>PLAYLIST</Text>
          <Text
            style={[
              styles.text,
              { fontSize: 15, fontWeight: "500", marginTop: 8 },
            ]}
          >
            Subscribe to DesignIntoCode
          </Text>
        </View>

        <View style={styles.coverContainer}>
          <Image
            source={require("../../assets/musique.jpg")}
            style={styles.cover}
          ></Image>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 32,
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={32} color="gray" />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            <Text
              style={[styles.textDark, { fontSize: 20, fontWeight: "500" }]}
            >
              {playSongStore.nameSong}
            </Text>
            <Text style={[styles.text, { fontSize: 16, marginTop: 8 }]}>
              {playSongStore.nameAuthor}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="download-outline" size={32} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ margin: 32 }}>
        <Slider
          maximumValue={100}
          minimumValue={0}
          minimumTrackTintColor="#307ecc"
          maximumTrackTintColor="#000000"
          step={1}
          value={sliderValue}
          onValueChange={(sliderValue) => setSliderValue(sliderValue)}
        />
        <View
          style={{
            marginTop: -12,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.textLight, styles.timeStamp]}>1</Text>
          <Text style={[styles.textLight, styles.timeStamp]}>3</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
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
          onPress={pauseAction}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  coverContainer: {
    marginTop: 32,
    width: 250,
    height: 250,
    shadowColor: "#5D3F6A",
    shadowOffset: { height: 15 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
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
});
