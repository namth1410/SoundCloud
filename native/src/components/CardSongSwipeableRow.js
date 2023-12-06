import React from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { playSong } from "../redux/playSongSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import { addHistoryAsync } from "../redux/historySlice";
const CardSongSwipeableRow = ({ props }) => {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSongRedux);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const { playSound } = useAudio();

  const playSoundAction = async () => {
    if (nameSong !== playSongStore.infoSong.nameSong) {
      playSound(props);
    } else {
    }
  };
  const removeSongFromSuggestList = () => {
    const newSuggestList = suggestSongRedux.suggestSongList.filter(
      (item) => item.id !== id
    );
    dispatch(updateDataSuggestSongList(newSuggestList));
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0.2],
      outputRange: [-0.2, 0],
      extrapolate: "clamp",
    });

    return (
      <RectButton style={styles.leftAction}>
        {/* <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text> */}
        <Animated.View
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              removeSongFromSuggestList();
            }}
          >
            {/* <Ionicons name="trash-bin-outline" size={32} color="red" /> */}
            <Icon name="trash" size={32} color="red" />
          </TouchableOpacity>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable overshootLeft={false} renderLeftActions={renderLeftActions}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          padding: 5,
          overflow: "visible",
          marginVertical: 5,
        }}
      >
        <TouchableOpacity
          delayPressIn={1000}
          style={{ flex: 1 }}
          onPressOut={() => playSoundAction()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                resizeMode: "contain",
                width: 50,
                height: 50,
                borderRadius: 5,
                zIndex: 2,
              }}
              source={
                img === null || img === "" || img === "null"
                  ? require("../../assets/unknow.jpg")
                  : { uri: img }
              }
            />
            <View
              style={{
                flexDirection: "column",
                marginLeft: 10,
                flex: 1,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontWeight: "bold", color: "white" }}
              >
                {nameSong}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 2,
                  color: "#A3A1A2",
                  fontSize: 12,
                }}
              >
                {nameAuthor}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Ionicons
          name="reorder-three-outline"
          size={28}
          color="#F57C1F"
          style={{
            textAlignVertical: "center",
          }}
        />
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  actionText: {
    color: "white",
  },
});

export default CardSongSwipeableRow;
