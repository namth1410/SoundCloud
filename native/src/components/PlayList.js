import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Button,
  TouchableOpacity,
  TouchableOpacityBase,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import Card from "./Card";
import React, { useEffect } from "react";

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
              props={{
                src: require("../../assets/test.jpg"),
                name: "Việt Mix 2018-2019",
                label: "New Release",
              }}
            ></Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
