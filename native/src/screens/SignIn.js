import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch, useSelector } from "react-redux";
import { getAllSong } from "../redux/songSlice";
import { signIn } from "../redux/userSlice";
function createInfoUser(username, password) {
  return {
    username: username,
    password: password,
  };
}

export default function SignIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saveAccount, setSaveAccount] = useState(true);

  const userInfo = useSelector((state) => state.userInfo);
  const allSong = useSelector((state) => state.allSong);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      Keyboard.dismiss();
      await dispatch(signIn(createInfoUser(username, password))).then(
        (result) => {
          dispatch(getAllSong());
          if (saveAccount) {
            AsyncStorage.setItem("loginStatus", JSON.stringify(result.meta));
            const saveUser = async () => {
              const loggedAccounts = await AsyncStorage.getItem(
                "loggedAccounts"
              );
              const existingAccountList = loggedAccounts
                ? JSON.parse(loggedAccounts)
                : [];
              const newAccount = JSON.stringify(result.meta.arg);

              const existingIndex = existingAccountList.findIndex(
                (ac) => ac.username === newAccount.username
              );


              if (existingIndex !== -1) {
                existingAccountList.splice(existingIndex, 1);
                existingAccountList.unshift(newAccount);
              } else {
                existingAccountList.unshift(newAccount);
              }
              await AsyncStorage.setItem(
                "loggedAccounts",
                JSON.stringify(existingAccountList)
              );
            };
            saveUser();
          }
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
    // dispatch(signIn(createInfoUser(username, password)));
  };

  const handleSignInWithoutAccount = async () => {
    try {
      Keyboard.dismiss();
      await dispatch(getAllSong());
    } catch (error) {
      console.log(error);
    }
    Keyboard.dismiss();
    navigation.navigate("Main");
  };

  // useEffect(() => {
  //   if (userInfo.username) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Main" }],
  //     });
  //   }
  // }, [userInfo]);

  useEffect(() => {
    // if (allSong.songs.length > 0) {
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Main" }],
    // });
    // }
  }, [allSong]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={async () => {
              await dispatch(signIn(createInfoUser("string1", "string1"))).then(
                (result) => {
                  AsyncStorage.setItem(
                    "loginStatus",
                    JSON.stringify(result.meta)
                  );
                  dispatch(getAllSong());
                  if (saveAccount) {
                    AsyncStorage.setItem(
                      "loginStatus",
                      JSON.stringify(result.meta)
                    );
                    const saveUser = async () => {
                      const loggedAccounts = await AsyncStorage.getItem(
                        "loggedAccounts"
                      );
                      const existingAccountList = loggedAccounts
                        ? JSON.parse(loggedAccounts)
                        : [];
                      const newAccount = JSON.stringify(result.meta.arg);
                      const existingIndex = existingAccountList.findIndex(
                        (ac) => ac.username === ac.username
                      );

                      if (existingIndex !== -1) {
                        existingAccountList.splice(existingIndex, 1);
                        existingAccountList.unshift(newAccount);
                      } else {
                        existingAccountList.unshift(newAccount);
                      }
                      await AsyncStorage.setItem(
                        "loggedAccounts",
                        JSON.stringify(existingAccountList)
                      );
                    };
                    saveUser();
                  }
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Main" }],
                  });
                }
              );
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
          </TouchableOpacity>
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
            onPress={() => {
              handleSignIn();
            }}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => {
                handleSignInWithoutAccount();
              }}
            >
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
        {userInfo.loading || allSong.loading ? (
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
