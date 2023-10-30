import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import SuggestSongList from "../components/SuggestSongList";

export default function Suggest({ navigation }) {
  const playSongStore = useSelector((state) => state.playSongRedux);
  const { width, height } = Dimensions.get("window");
  const lottieRef = useRef(null);
  const audio = useAudio();
  useEffect(() => {
    if (audio.playing) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
    }
  }, [audio.playing]);

  return (
    <SafeAreaView>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: 0.9 * height,
        }}
      >
        <View
          style={{
            width: width,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
            Danh sách phát
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons style={{}} name="close-circle" size={32} color="gray" />
          </TouchableWithoutFeedback>
        </View>

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
            source={require("../../assets/gai.jpg")}
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
              {playSongStore.infoSong.nameSong}
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
              {playSongStore.infoSong.nameAuthor}
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

        <Text
          style={{
            paddingLeft: 10,
            color: "black",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          Phát tiếp theo
        </Text>
        <SuggestSongList></SuggestSongList>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
  },
  item: {
    backgroundColor: "gray",
    borderWidth: 1,
    borderColor: "black",
    minHeight: 30,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
