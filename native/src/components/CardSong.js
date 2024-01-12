import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import { useAudio } from "../common/AudioProvider";
export default function CardSong({ props }) {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSongRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const { playSound } = useAudio();
  const playSoundAction = async () => {
    if (nameSong !== playSongStore.infoSong.nameSong) {
      playSound(props);
    } else {
    }
  };

  return (
    <TouchableOpacity delayPressIn={1000} onPressOut={() => playSoundAction()}>
      <View style={{ width: 130 }}>
        <Image
          style={{
            resizeMode: "contain",
            width: 120,
            height: 120,
            borderRadius: 5,
            zIndex: 2,
          }}
          src={img ?? require("../../assets/musique.jpg")}
        />

        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontWeight: "bold", marginTop: 15, color: "white" }}
        >
          {nameSong}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            marginTop: 2,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12,
          }}
        >
          {nameAuthor}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
