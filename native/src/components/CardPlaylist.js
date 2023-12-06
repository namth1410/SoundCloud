import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getSongsFromPlaylist } from "../redux/playlistDetailSlice";
import Icon from "react-native-vector-icons/FontAwesome";

export default function CardPlaylist({ props }) {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfoRedux = useSelector((state) => state.userInfo);
  const authorInfoRedux = useSelector((state) => state.authorInfoRedux);

  const openPlaylistDetail = async () => {
    dispatch(
      getSongsFromPlaylist({
        idPlaylist: props.id,
        token: userInfoRedux.token,
      })
    ).then(() => {});
    navigation.navigate("PlaylistDetail", { data: props });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        delayPressIn={1000}
        onPressOut={() => openPlaylistDetail()}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 7,
            backgroundColor: "rgb(15,15,15)",
            marginBottom: 15,
            overflow: "visible",
            borderRadius: 5,
          }}
        >
          <Image
            style={{
              resizeMode: "cover",
              width: 65,
              height: 65,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={
              props.imgFirstSong === null ||
              props.imgFirstSong === "" ||
              props.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: props.imgFirstSong }
            }
          />

          <Image
            blurRadius={10}
            style={{
              resizeMode: "cover",
              width: 65,
              height: 65,
              borderRadius: 5,
              position: "absolute",
              top: 12,
              left: 5,
            }}
            source={
              props.imgFirstSong === null ||
              props.imgFirstSong === "" ||
              props.imgFirstSong === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: props.imgFirstSong }
            }
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.55 * width,
              marginTop: 5,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {props.namePlaylist}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 2,
                  color: "#A3A1A2",
                  fontSize: 12,
                }}
              >
                {authorInfoRedux.nameAuthor !== ""
                  ? authorInfoRedux.nameAuthor
                  : userInfoRedux.name}
              </Text>
              <Icon
                style={{ marginHorizontal: 5 }}
                name="circle"
                size={4}
                color="#A3A1A2"
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 2,
                  color: "#A3A1A2",
                  fontSize: 12,
                }}
              >
                {`${props.numberTrack} Tracks`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          ></View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 10,
  },
  optionsWrapper: {},
  optionWrapper: {
    backgroundColor: "yellow",
    margin: 5,
  },
  optionTouchable: {
    underlayColor: "green",
    activeOpacity: 70,
  },
  optionText: {},
};
