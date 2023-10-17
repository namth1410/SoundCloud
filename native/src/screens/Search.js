import React from "react";
import { Text, View } from "react-native";
import SuggestSongList from "../components/SuggestSongList";

export default function Search({}) {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Text>Search</Text>
      {/* {showLottie && (
        <LottieView
          style={{
            width: 400,
            height: 400,
          }}
          ref={lottieRef}
          source={require("../../assets/heart.json")}
          renderMode={"SOFTWARE"}
          loop={false}
          onAnimationFinish={handleAnimationFinish}
        />
      )} */}

      <SuggestSongList></SuggestSongList>
    </View>
  );
}
