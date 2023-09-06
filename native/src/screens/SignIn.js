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
} from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SignIn({ navigation }) {
  return (
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
        />
        <TextInput
          style={styles.emailInput}
          placeholder="Mật khẩu"
          selectionColor={"black"}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("SoundCloudTabs");
          }}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity>
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
