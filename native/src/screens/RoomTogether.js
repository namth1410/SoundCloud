import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Tab, TabView } from "@rneui/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { hubConnection, useAudio } from "../common/AudioProvider";
import { clearDataRoom } from "../redux/dataRoomSlice";
import { clearUserConnect } from "../redux/userConnectSlice";

export default function RoomTogether({}) {
  const route = useRoute();
  const usernameFriend = route.params ? route.params.data : null;
  const {
    modeTogether,
    setModeTogether,
    playSound,
    pauseSound,
    continuePlaySound,
  } = useAudio();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const scrollViewRef = useRef(null);
  const userInfo = useSelector((state) => state.userInfo);
  const userConnectRedux = useSelector((state) => state.userConnectRedux);
  const dataRoomRedux = useSelector((state) => state.dataRoomRedux);

  const [messageStorage, setMessageStorage] = useState([]);
  const [indexTab, setIndexTab] = useState(0);
  const [message, setMessage] = useState();

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const exitRoom = () => {
    setModeTogether(false);
    navigation.goBack();
    ToastAndroid.show(
      `Ngắt kết nối với ${userConnectRedux.userConnect.user.name}`,
      ToastAndroid.SHORT
    );
    dispatch(clearDataRoom());
    dispatch(clearUserConnect());
  };

  const handleExit = () => {
    if (modeTogether) {
      Alert.alert(
        "Thoát khỏi chế độ ",
        `Hủy kết nối với ${userConnectRedux.userConnect.user.name}?`,
        [
          {
            text: "Không",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Đồng ý",
            onPress: () => {
              hubConnection.invoke("CancelConnectionReq", usernameFriend);
              exitRoom();
            },
          },
        ]
      );
      return true;
    } else {
      return false;
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      let message_o = {
        message: message,
        username: userInfo.username,
        createAt: new Date().getTime(),
      };
      setMessageStorage([...messageStorage, message_o]);
      setMessage("");
      hubConnection.invoke(
        "SendChatMessage",
        usernameFriend,
        JSON.stringify(message_o)
      );
    }
  };

  const TemplateMessage = (item) => {
    return (
      <View
        style={{
          backgroundColor: "pink",
          borderRadius: 50,
          padding: 0,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ width: "auto", padding: 10 }}>{item.message}</Text>
      </View>
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleExit
    );

    hubConnection.on("ReceiveMessage", (message_o) => {
      setMessageStorage((prevMessages) => [
        ...prevMessages,
        JSON.parse(message_o),
      ]);
    });

    hubConnection.on("CancelConnection", (message_o) => {
      exitRoom();
    });

    hubConnection.on("MeetPlayTrack", (track) => {
      console.log(JSON.parse(track));
      playSound(
        JSON.parse(track),
        (recordHistory = true),
        (meetPlayTrack = true)
      );
    });

    hubConnection.on("MeetPauseTrack", () => {
      pauseSound((meetPauseTrack = true));
    });

    hubConnection.on("MeetContinueTrack", () => {
      continuePlaySound((meetContinueTrack = true));
    });

    const saveUser = async () => {
      const userListConnected = await AsyncStorage.getItem("userListConnected");
      const existingUserList = userListConnected
        ? JSON.parse(userListConnected)
        : [];
      const newUser = userConnectRedux.userConnect.user;

      const existingIndex = existingUserList.findIndex(
        (user) => user.username === newUser.username
      );

      if (existingIndex !== -1) {
        existingUserList.splice(existingIndex, 1);
        existingUserList.unshift(newUser);
      } else {
        existingUserList.unshift(newUser);
      }


      await AsyncStorage.setItem(
        "userListConnected",
        JSON.stringify(existingUserList)
      );
    };
    saveUser();

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // console.log(messageStorage);
  }, [messageStorage]);

  useEffect(() => {}, [dataRoomRedux]);

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <View
        style={{
          height: "100%",
          backgroundColor: "rgb(15,15,15)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#F57C1F", fontSize: 16, fontWeight: "bold" }}>
            Nghe nhạc cùng nhau
          </Text>
          <TouchableOpacity
            onPressOut={() => {
              handleExit();
            }}
            style={{
              backgroundColor: "#333",
              borderRadius: 5,
              paddingHorizontal: 5,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: "white" }}>Thoát</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "rgb(15,15,15)", flex: 1 }}>
          <Tab
            style={{ backgroundColor: "rgb(15,15,15)" }}
            titleStyle={{ color: "white", fontSize: 12 }}
            indicatorStyle={{ backgroundColor: "#F57C1F" }}
            value={indexTab}
            onChange={setIndexTab}
          >
            <Tab.Item>Track</Tab.Item>
            <Tab.Item>Nhắn tin</Tab.Item>
          </Tab>
          <TabView
            value={indexTab}
            onChange={setIndexTab}
            animationType="spring"
          >

            <TabView.Item style={{ backgroundColor: "#ccc", width: "100%" }}>
              <View style={{ flex: 1 }}></View>
            </TabView.Item>
            <TabView.Item
              style={{ backgroundColor: "white", width: "100%", flex: 1 }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "#333",
                    width: "100%",
                    height: "auto",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", marginRight: 10 }}>
                    Trò chuyện cùng
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      marginRight: 10,
                    }}
                  >
                    {userConnectRedux.userConnect.user.name}
                  </Text>
                  <Image
                    style={{
                      resizeMode: "contain",
                      width: 40,
                      height: 40,
                      borderRadius: 1000,
                    }}
                    source={
                      userConnectRedux.userConnect.user.avatar === null ||
                      userConnectRedux.userConnect.user.avatar === "" ||
                      userConnectRedux.userConnect.user.avatar === "null"
                        ? require("../../assets/anonymous.jpg")
                        : { uri: userConnectRedux.userConnect.user.avatar }
                    }
                  />
                </View>

                <ScrollView
                  ref={scrollViewRef}
                  onContentSizeChange={handleContentSizeChange}
                  style={{
                    height: "80%",
                    flex: 1,
                    marginBottom: 50,
                    backgroundColor: "rgb(15,15,15)",
                    paddingHorizontal: 5,
                  }}
                >
                  {messageStorage.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "#303030",
                          borderRadius: 5,
                          margin: 2,
                          alignSelf:
                            item.username === userInfo.username
                              ? "flex-start"
                              : "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            width: "auto",
                            padding: 10,
                            maxWidth: "60%",
                            color: "white",
                          }}
                        >
                          {item.message}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>

                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps="always"
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    backgroundColor: "#303030",
                    position: "absolute",
                    bottom: 0,
                  }}
                  contentContainerStyle={{
                    alignItems: "center",
                    flexDirection: "row",
                    height: 50,
                  }}
                >
                  <TextInput
                    placeholder="Nhập tin nhắn..."
                    onChangeText={(message) => {
                      setMessage(message);
                    }}
                    placeholderTextColor="#8C8C8C"
                    value={message}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontSize: 16,
                      color: "white",
                    }}
                  ></TextInput>
                  <TouchableOpacity
                    style={{ padding: 10, zIndex: 10 }}
                    onPressOut={() => {
                      sendMessage();
                    }}
                  >
                    <Ionicons name="send" color="#F57C1F" size={30} />
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </View>
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
}
