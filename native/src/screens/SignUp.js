import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import Icon from "react-native-vector-icons/FontAwesome";
import { signUp } from "../redux/userSlice";

export default function SignUp({ navigation }) {
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfPassword, setCfPassword] = useState("");

  function createInfoUser(username, password, cfPassword) {
    return {
      username: username,
      password: password,
      confirmPassword: cfPassword,
    };
  }

  const handleSignUp = () => {
    dispatch(signUp(createInfoUser(username, password, cfPassword)));
  };

  useEffect(() => {
    if (userInfo.success) {
      Alert.alert("Alert Title", "My Alert Msg", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }, [userInfo.success]);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={40} color="#F57C1F" />
      </TouchableOpacity>
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
        <TextInput
          style={styles.emailInput}
          placeholder="Xác nhận mật khẩu"
          selectionColor={"black"}
          secureTextEntry={true}
          onChangeText={(_cfPassword) => setCfPassword(_cfPassword)}
        />
        <Text style={styles.text_err}>{userInfo.error}</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
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
