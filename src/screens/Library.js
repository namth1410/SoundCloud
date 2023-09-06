import { StatusBar } from "expo-status-bar";
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
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const Option = ({ title }) => {
  return (
    <TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 5,
          paddingBottom: 5,
          marginBottom: 5,
        }}
      >
        <Text style={{ fontSize: 15 }}>{title}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={30}
          color="#F57C1F"
          style={{ justifyContent: "flex-end" }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default function Library({ navigation }) {
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
          Library
        </Text>

        <ScrollView>
          <Option title="Tracks yêu thích"></Option>
          <Option title="Tracks yêu thích"></Option>
          <Option title="Tracks yêu thích"></Option>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
