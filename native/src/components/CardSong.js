import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Button,
  TouchableOpacity,
  TouchableOpacityBase,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Audio } from "expo-av";
import { playSong, pauseSong, cancelSong } from "../redux/playSongSlice";

export default function Card({ props }) {
  const { img, nameSong, nameAuthor, linkSong } = props;
  const playSongObj = useSelector((state) => state.playSong);
  const dispatch = useDispatch();
  const sound = React.useRef(new Audio.Sound());
  const SampleTrack = require('../../assets/music.mp3');

  const playSound = async () => {
    const checkLoading = await sound.current.getStatusAsync();
    console.log("log ra");
    console.log(checkLoading);
    if (!checkLoading.isLoaded) {
      console.log("Trước khi dispatch");
      console.log(playSongObj);
      console.log("Gia tri truyen vao");
      console.log(`${nameSong} ${nameAuthor}`);
      // dispatch(
      //   playSong({
      //     img: "",
      //     nameSong: nameSong,
      //     nameAuthor: nameAuthor,
      //     linkSong: linkSong,
      //   })
      // );
      // // await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      // console.log("Sau khi dispatch");
      // console.log(playSongObj);

      // const { sound: playbackObject } = await Audio.Sound.createAsync(
      //   { uri: playSongObj.linkSong },
      //   { shouldPlay: true }
      // );
      try {
        const result = await sound.current.loadAsync(SampleTrack, {}, true);
        sound.current.playAsync();
        if (result.isLoaded === false) {
          console.log('Error in Loading Audio');
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // await Audio.setIsEnabledAsync(false);
      console.log("Chui vao else");
      sound.current.pauseAsync();
      // Tạo và phát âm thanh mới
      // const { sound: playbackObject } = await Audio.Sound.createAsync(
      //   { uri: linkSong },
      //   { shouldPlay: true }
      // );
    }
  };

  return (
    <TouchableOpacity onPress={() => playSound()}>
      <View style={{ width: 130 }}>
        <Image
          style={{
            resizeMode: "contain",
            width: 120,
            height: 120,
            borderRadius: 5,
            zIndex: 2,
          }}
          source={img ?? require("../../assets/musique.jpg")}
        />
        <Image
          blurRadius={100}
          style={{
            resizeMode: "contain",
            width: 120,
            height: 120,
            borderRadius: 5,
            top: 8,
            left: 8,
            position: "absolute",
          }}
          source={img}
        />
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontWeight: "bold", marginTop: 15 }}
        >
          {nameSong}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            marginTop: 2,
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: 12,
          }}
        >
          {nameAuthor}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
