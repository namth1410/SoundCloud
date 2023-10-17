import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAudio } from "../common/AudioProvider";

export default MyComponent = React.memo(function () {
  // });

  // export default function MySlider() {
  const { duration, curTime, setPositionAudio } = useAudio();

  const [sliderValue, setSliderValue] = useState(10);

  function formatMillisecondsToTime(milliseconds) {
    if (milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedTime = `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;

      return formattedTime;
    }
    return "0:00";
  }

  useEffect(() => {
    setSliderValue(curTime);
  }, [curTime]);

  return (
    <View style={{ flexWrap: "wrap", flex: 1, flexDirection: "column" }}>
      <Slider
        maximumValue={duration}
        minimumValue={0}
        minimumTrackTintColor="#307ecc"
        maximumTrackTintColor="#000000"
        step={1000}
        value={curTime}
        style={{ width: "100%" }}
        onValueChange={(curTime) => {
          setSliderValue(curTime);
        }}
        onSlidingComplete={(curTime) => {
          setPositionAudio(curTime);
        }}
      />
      <View
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text style={[styles.textLight, styles.timeStamp]}>
          {formatMillisecondsToTime(sliderValue)}
        </Text>
        <Text style={[styles.textLight, styles.timeStamp]}>
          {formatMillisecondsToTime(duration)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  textLight: {
    color: "#B6B7BF",
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500",
  },
});
