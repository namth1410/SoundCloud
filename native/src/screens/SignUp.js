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
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp({ navigation }) {
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
        />
        <TextInput
          style={styles.emailInput}
          placeholder="Mật khẩu"
          selectionColor={"black"}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.emailInput}
          placeholder="Xác nhận mật khẩu"
          selectionColor={"black"}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.buttonContainer}>
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
