import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Feed({}) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "red",
          flex: 1,
          width: 100,
          height: 100,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <TouchableOpacity>
          <Text>Start the modal flow!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
