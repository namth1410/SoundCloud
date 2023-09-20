import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { cancelSound, playSound } from "../common/appSong";
import { changePlaySong, playSong } from "../redux/playSongSlice";
import { TYPE_ACTION } from "../common/typeAction";
import { useNavigation } from "@react-navigation/native";
import ModalSong from "./ModalSong";
import { showModal } from "../redux/modalSlice";

export default function Card({ props }) {
  const { img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();
  const playSoundAction = async () => {
    if (nameSong !== playSongStore.nameSong) {
      console.log("Thay doi bai hat");
      console.log(nameSong);
      dispatch(
        playSong({
          img: "",
          nameSong: nameSong,
          nameAuthor: nameAuthor,
          linkSong: linkSong,
          typeAction: TYPE_ACTION.CHANGE,
        })
      );
      dispatch(showModal());
    } else {
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
      <ModalSong></ModalSong>
    </TouchableOpacity>
  );
}
