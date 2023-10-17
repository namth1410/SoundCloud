import React, { useEffect, useRef } from "react";
import { Dimensions, Image, Text, View } from "react-native";

import LottieView from "lottie-react-native";
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
        width: "94%",
        flexDirection: "row",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: "visible",
        backgroundColor: "#B9B4C7",
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
        source={img ?? require("../../assets/gai.jpg")}
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
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <LottieView
          style={{
            width: 20,
            height: 20,
            position: "absolute",
            transform: [{ scale: 1.3 }],
          }}
          ref={lottieRef}
          source={require("../../assets/playing.json")}
          renderMode={"SOFTWARE"}
          loop={true}
        />
      </View>
    </View>
  );
}
