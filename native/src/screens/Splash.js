import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/FontAwesome";
import { signUp } from "../redux/userSlice";
import { signIn } from "../redux/userSlice";
import { getAllSong } from "../redux/songSlice";
import { useNavigation } from "@react-navigation/native";

function createInfoUser(username, password) {
  return {
    username: username,
    password: password,
  };
}

export default function Splash({ navigation }) {
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfPassword, setCfPassword] = useState("");

  useEffect(() => {
    const a = async () => {
      const _loginStatus = await AsyncStorage.getItem("loginStatus");
      const loginStatus = JSON.parse(_loginStatus);
      if (loginStatus) {
        try {
          Keyboard.dismiss();
          await dispatch(
            signIn(
              createInfoUser(loginStatus.arg.username, loginStatus.arg.password)
            )
          ).then(async (result) => {
            AsyncStorage.setItem("loginStatus", JSON.stringify(result.meta));
            await dispatch(getAllSong()).then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" }],
              });
            });
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }],
          });
        }, 2000);
      }
    };
    a();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={{
          resizeMode: "contain",
          height: 100,
          width: 200,
        }}
      />
    </View>
  );
}
