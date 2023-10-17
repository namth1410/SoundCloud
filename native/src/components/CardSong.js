import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
export default function Card({ props }) {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSongRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const { playSound } = useAudio();
  const playSoundAction = async () => {
    if (nameSong !== playSongStore.nameSong) {
      playSound({ uri: linkSong });
      dispatch(addHistoryAsync({ ...props, token: userInfoRedux.token }));
      dispatch(
        playSong({
          id: id,
          img: "",
          nameSong: nameSong,
          nameAuthor: nameAuthor,
          linkSong: linkSong,
        })
      );
    } else {
    }
  };

  return (
    <TouchableOpacity onPressIn={() => playSoundAction()}>
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
