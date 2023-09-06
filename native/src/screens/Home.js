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
import React, { useEffect } from "react";
import Card from "../components/Card";
import PlayList from "../components/PlayList";
import { useSelector, useDispatch } from "react-redux";
import { top100 } from "../redux/top100Slice";

export default function Home({ navigation }) {
  const count = useSelector((state) => state.top100);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(count);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
        <TouchableOpacity>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "#F57C1F",
              paddingLeft: 12,
              paddingTop: 6,
              paddingBottom: 12,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>

        <ScrollView>
          <PlayList
            props={{ title: "Nghe gần đây", playList: [1, 2, 3] }}
          ></PlayList>
          <PlayList
            props={{ title: "Thịnh hành", playList: [1, 2, 3] }}
          ></PlayList>
          <PlayList
            props={{ title: "Top 100", playList: [1, 2, 3] }}
          ></PlayList>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
