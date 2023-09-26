import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ModalSong from "./ModalSong";
import { useAudio } from "../common/AudioProvider";
import { playSong } from "../redux/playSongSlice";
import { TYPE_ACTION } from "../common/typeAction";
import { showModal } from "../redux/modalSlice";
export default function Card({ props }) {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();
  const { test, playSound } = useAudio();
  const playSoundAction = async () => {
    if (nameSong !== playSongStore.nameSong) {
      console.log("play");
      console.log(id);
      dispatch(
        playSong({
          id: id,
          img: "",
          nameSong: nameSong,
          nameAuthor: nameAuthor,
          linkSong: linkSong,
          typeAction: TYPE_ACTION.CHANGE,
        })
      );
      dispatch(showModal());
    } else {
      dispatch(showModal());
    }
  };

  // useEffect(() => {
  //   if (playSongStore.playing && nameSong === playSongStore.nameSong) {
  //     playSound({ uri: playSongStore.linkSong });
  //   } else if (nameSong !== playSongStore.nameSong) {
  //     cancelSound();
  //   }
  // }, [playSongStore]);

  return (
    <TouchableOpacity onPress={() => playSoundAction()}>
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
