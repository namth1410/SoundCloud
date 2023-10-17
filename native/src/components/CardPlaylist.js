import { useNavigation } from "@react-navigation/native";
import React from "react";
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

export default function CardPlaylist({ props }) {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfoRedux = useSelector((state) => state.userInfo);

  const openPlaylistDetail = async () => {
    dispatch(
      getSongsFromPlaylist({
        idPlaylist: props.id,
        token: userInfoRedux.token,
      })
    ).then((result) => {});
    navigation.navigate("PlaylistDetail", { data: props });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => openPlaylistDetail()}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 7,
            backgroundColor: "gray",
            marginBottom: 15,
            overflow: "visible",
            borderRadius: 5,
          }}
        >
          <Image
            style={{
              resizeMode: "cover",
              width: 50,
              height: 50,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={require("../../assets/gai.jpg")}
          />

          <Image
            blurRadius={10}
            style={{
              resizeMode: "cover",
              width: 50,
              height: 50,
              borderRadius: 5,
              position: "absolute",
              top: 10,
              left: 5,
            }}
            source={require("../../assets/gai.jpg")}
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.55 * width,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {props.namePlaylist}
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
              {props.name}
            </Text>
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
