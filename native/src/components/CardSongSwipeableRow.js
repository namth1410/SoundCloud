import React, { useEffect } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { playSong } from "../redux/playSongSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
const CardSongSwipeableRow = ({ props }) => {
  const { id, img, nameSong, nameAuthor, linkSong } = props;
  const playSongStore = useSelector((state) => state.playSongRedux);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const dispatch = useDispatch();
  const { playSound } = useAudio();

  useEffect(() => {
    console.log(props);
  }, []);
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
            <Ionicons name="trash-bin-outline" size={32} color="red" />
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
        }}
      >
        <TouchableOpacity
          delayPressIn={50}
          style={{ flex: 1 }}
          onPress={() => playSoundAction()}
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
              source={img ?? require("../../assets/test.jpg")}
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
                style={{ fontWeight: "bold" }}
              >
                {nameSong}
              </Text>
              <Text
                numberOfLines={1}
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
          </View>
        </TouchableOpacity>
        <Ionicons
          name="ellipsis-vertical-outline"
          size={28}
          color="#F57C1F"
          style={{
            textAlignVertical: "center",
          }}
        />
        {/* <Menu
        renderer={Popover}
          rendererProps={{ placement: "bottom" }}
          style={{ backgroundColor: "pink", justifyContent: "center" }}
        >
          <MenuTrigger
            customStyles={{
              triggerWrapper: {},
            }}
          >

          </MenuTrigger>
          <MenuOptions
            style={{
              overflow: "visible",
              backgroundColor: "blue",
              borderRadius: 5,
            }}
          >
            <MenuOption onSelect={() => alert(`Save`)} text="Save" />
            <MenuOption onSelect={() => alert(`Delete`)} text="Delete" />
          </MenuOptions>
          <TouchableOpacity
            onPress={() => {
              testDeleteSong();
            }}
          >
            <Ionicons
              name="ellipsis-vertical-outline"
              size={28}
              color="#F57C1F"
              style={{
                textAlignVertical: "center",
                backgroundColor: "pink",
                flex: 1,
              }}
            />
          </TouchableOpacity>
        </Menu> */}
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
