import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CardSongForHistory from "../components/CardSongForHistory";

export default function History({}) {
  const historyRedux = useSelector((state) => state.historyRedux);
  const [data, setData] = useState(historyRedux.historyList);

  useEffect(() => {
    setData(historyRedux.historyList);
  }, [historyRedux.historyList]);

  const renderItem = ({ item }) => {
    return <CardSongForHistory props={{ ...item }}></CardSongForHistory>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
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
          Lịch sử phát
        </Text>

        <View style={{ padding: 10 }}>
          <FlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
