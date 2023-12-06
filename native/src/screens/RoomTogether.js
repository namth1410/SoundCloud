import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { BASE_URL } from "../redux/configAPI";
import { useSelector } from "react-redux";
import { Tab, TabView } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { hubConnection } from "./Feed";
import { useRoute } from "@react-navigation/native";

export default function RoomTogether({}) {
  const route = useRoute();
  const usernameFriend = route.params ? route.params.data : null;
  const scrollViewRef = useRef(null);
  const userInfo = useSelector((state) => state.userInfo);
  const userConnectRedux = useSelector((state) => state.userConnectRedux);

  const [messageStorage, setMessageStorage] = useState([]);
  const [indexTab, setIndexTab] = useState(0);
  const [message, setMessage] = useState();

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    scrollViewRef.current.scrollToEnd({ animated: true });
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
    hubConnection.on("ReceiveMessage", (message_o) => {
      setMessageStorage((prevMessages) => [
        ...prevMessages,
        JSON.parse(message_o),
      ]);
    });

    console.log(userConnectRedux.userConnect);
  }, []);

  useEffect(() => {
    // console.log(messageStorage);
  }, [messageStorage]);

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <View
        style={{
          height: "100%",
        }}
      >
        <TouchableOpacity>
          <Text>Thoát</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: "#ffc", flex: 1 }}>
          <Tab value={indexTab} onChange={setIndexTab}>
            <Tab.Item>Tìm kiếm</Tab.Item>
            <Tab.Item>Track</Tab.Item>
            <Tab.Item>Nhắn tin</Tab.Item>
          </Tab>
          <TabView
            value={indexTab}
            onChange={setIndexTab}
            animationType="spring"
          >
            <TabView.Item style={{ width: "100%" }}>
              <View style={{ flex: 1 }}></View>
            </TabView.Item>
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
                    backgroundColor: "#DADDB1",
                    width: "100%",
                    height: "auto",
                  }}
                >
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Trò chuyện cùng
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "black",
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
                  style={{ height: "80%", flex: 1, marginBottom: 50 }}
                >
                  {messageStorage.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "pink",
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
                          }}
                        >
                          {item.message}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>

                <View
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    backgroundColor: "#ccc",
                    flexDirection: "row",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 0,
                    height: 50,
                  }}
                >
                  <TextInput
                    placeholder="Nhập tin nhắn..."
                    onChangeText={(message) => {
                      setMessage(message);
                    }}
                    value={message}
                    style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
                  ></TextInput>
                  <TouchableOpacity
                    onPressOut={() => {
                      sendMessage();
                    }}
                  >
                    <Ionicons name="send" color="blue" size={30} />
                  </TouchableOpacity>
                </View>
              </View>
            </TabView.Item>
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
}
