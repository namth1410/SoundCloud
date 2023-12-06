import React, { useEffect, useRef } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";

import LottieView from "lottie-react-native";
import { convertTimeTrackToString } from "../ultis/FunctionHelper";

export default function CardSongSmall({ props }) {
  const { img, nameSong, nameAuthor, playing } = props;
  const { width } = Dimensions.get("window");
  const lottieRef = useRef(null);

  useEffect(() => {
    if (playing) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
    }
  }, [playing]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: "visible",
        backgroundColor: "rgb(15,15,15)",
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
        source={
          img === null || img === "" || img === "null"
            ? require("../../assets/unknow.jpg")
            : { uri: img }
        }
      />
      <View
        style={{
          flexDirection: "column",
          marginLeft: 15,
          width: 0.6 * width,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontWeight: "bold", color: "white" }}
        >
          {nameSong}
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
            {nameAuthor}
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
            {convertTimeTrackToString(props.time)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignItems: "flex-end",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color="#A3A1A2"
          style={{
            textAlignVertical: "center",
          }}
        />
        <LottieView
          style={{
            width: 20,
            height: 20,
            position: "absolute",
            transform: [{ scale: 1.3 }],
            display: "none",
          }}
          ref={lottieRef}
          source={require("../../assets/playing.json")}
          renderMode={"SOFTWARE"}
          loop={true}
        />
      </TouchableOpacity>
    </View>
  );
}
