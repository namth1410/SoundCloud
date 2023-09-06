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

export default function Card({ props }) {
  const { src, name, label } = props;
  return (
    <View style={{ width: 130 }}>
      <Image
        style={{
          resizeMode: "contain",
          width: 120,
          height: 120,
          borderRadius: 5,
          zIndex: 2,
        }}
        source={src}
      />
      <Image
        blurRadius={100}
        style={{
          resizeMode: "contain",
          width: 120,
          height: 120,
          borderRadius: 5,
          top: 8,
          left: 8,
          position: "absolute",
        }}
        source={src}
      />
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{ fontWeight: "bold", marginTop: 15 }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          marginTop: 2,
          color: "rgba(0, 0, 0, 0.6)",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
