import React from "react";
import { ScrollView, Text, View } from "react-native";
import Card from "./CardSong";

export default function PlayList({ props }) {
  const { title, playList } = props;

  return (
    <View>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 20,
          marginBottom: 15,
          paddingLeft: 12,
        }}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 15,
            paddingLeft: 12,
          }}
        >
          {playList.map((item, index) => (
            <Card
              key={index}
              // props={{
              //   img: require("../../assets/musique.jpg"),
              //   nameSong: item.nameSong,
              //   nameAuthor: item.nameAuthor,
              //   linkSong: item.linkSong,
              // }}
              props={item}
            ></Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
