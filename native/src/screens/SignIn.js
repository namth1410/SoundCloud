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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import { useSelector, useDispatch } from "react-redux";
import { _signIn, signIn } from "../redux/userSlice";
import axios from "axios";
import { getAllSong } from "../redux/songSlice";
const baseUrl = "https://4e76-27-72-145-105.ngrok-free.app";
function createInfoUser(username, password) {
  return {
    username: username,
    password: password,
  };
}

export default function SignIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      Keyboard.dismiss();
      await dispatch(_signIn(createInfoUser(username, password))).then(
        () => {}
      );
    } catch (error) {
      console.log(error);
    }
    // dispatch(signIn(createInfoUser(username, password)));
  };

  const handleSignInWithoutAccount = () => {
    try {
      Keyboard.dismiss();
      dispatch(getAllSong());
    } catch (error) {
      console.log(error);
    }
    Keyboard.dismiss();
    navigation.navigate("SoundCloudTabs");
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (userInfo.username) {
      navigation.reset({
        index: 0,
        routes: [{ name: "SoundCloudTabs" }],
      });
    }
  }, [userInfo]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={styles.head}>
          <Image
            source={require("../../assets/logo.png")}
            style={{
              resizeMode: "contain",
              height: 100,
              width: 200,
            }}
          />
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.emailInput}
            placeholder="Tài khoản"
            selectionColor={"black"}
            onChangeText={(_username) => setUsername(_username)}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="Mật khẩu"
            selectionColor={"black"}
            secureTextEntry={true}
            onChangeText={(_password) => setPassword(_password)}
          />

          <Text style={styles.text_err}>{userInfo.error}</Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={handleSignInWithoutAccount}>
              <Text style={styles.option}>Sử dụng mà không cần đăng nhập</Text>
            </TouchableOpacity>
            <Text>hoặc</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <Text style={styles.option}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
        {userInfo.loading ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#F57C1F" />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  head: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    marginTop: 60,
  },
  form: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },

  emailInput: {
    width: 250,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    paddingLeft: 15,
  },
  text_err: {
    color: "red",
  },

  buttonContainer: {
    width: 250,
    marginTop: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "#F57C1F",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  optionsContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 5,
  },
  option: {
    textDecorationLine: "underline",
  },
});
