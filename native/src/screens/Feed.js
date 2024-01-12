import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  ToastAndroid,
  BackHandler,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import Ionicons from "react-native-vector-icons/Ionicons";

import { BASE_URL } from "../redux/configAPI";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getUserByUsername } from "../redux/userConnectSlice";
import { useAudio } from "../common/AudioProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInfoAuthor } from "../redux/authorSlice";

export const hubConnection = new HubConnectionBuilder()
  .withUrl(`${BASE_URL}/hubs`)
  .configureLogging(LogLevel.Information)
  .build();

export default function Feed({}) {
  const { width } = Dimensions.get("window");

  const { modeTogether, setModeTogether, cancelSound } = useAudio();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.userInfo);
  const [idConnect, setIdConnect] = useState();
  const [waitingConnect, setWaitingConnect] = useState(false);
  const [userListConnected, setUserListConnected] = useState([]);

  const renderItemAuthor = ({ item }) => {
    return (
      <TouchableOpacity
        delayPressIn={1000}
        onPressOut={() => {
          // dispatch(
          //   getInfoAuthor({
          //     idUser: item.id,
          //   })
          // );
          // navigation.navigate("Author");
        }}
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          marginVertical: 15,
          alignItems: "center",
          height: "auto",
          width: width,
        }}
      >
        <Image
          style={{
            resizeMode: "contain",
            width: 100,
            height: 100,
            borderRadius: 1000,
          }}
          source={
            item.avatar
              ? { uri: item.avatar }
              : require("../../assets/anonymous.jpg")
          }
        />
        <View
          style={{
            flexDirection: "column",
            height: 100,
            flex: 1,
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" color="#A3A1A2" size={16} />

            <Text style={{ color: "#A3A1A2", fontSize: 12, marginLeft: 5 }}>
              Ha Noi
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="musical-notes-outline" color="#A3A1A2" size={16} />

            <Text style={{ color: "#A3A1A2", fontSize: 12, marginLeft: 5 }}>
              {`${item.trackCount} Tracks`}
            </Text>
          </View>
        </View>

        <View style={{}}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              paddingRight: 10,
            }}
            onPress={() => {
              setIdConnect(item.username);
              hubConnection.invoke(
                "SendConnectionRequest",
                userInfo.username,
                item.username
              );
              setWaitingConnect(true);
            }}
          >
            <Ionicons name="hand-right-outline" color="#F57C1F" size={30} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (modeTogether) {
        return true;
      } else {
        return false;
      }
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);

    hubConnection
      .start()
      .then(() => {
        console.log("connect success");
        hubConnection.invoke("OnConnected", userInfo.username);
        // hubConnection.invoke("ConnectToChat", userInfo.username);
      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
      });

    hubConnection.on("ConnectedToChat", (message) => {
      console.log(message);
    });

    hubConnection.on("ConnectionRequest", (fromUserId) => {
      // Hiển thị yêu cầu kết nối và cho phép người dùng đồng ý hoặc từ chối
      // Ví dụ: Hiển thị thông báo hoặc giao diện cho phép người dùng xác nhận
      Alert.alert("Yêu cầu kết nối ", `Chấp nhận kết nối với ${fromUserId}?`, [
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => {
            hubConnection.invoke(
              "RefuseConnectionRequest",
              fromUserId,
              userInfo.username
            );
          },
        },
        {
          text: "OK",
          onPress: () => {
            hubConnection.invoke(
              "AcceptConnectionRequest",
              fromUserId,
              userInfo.username
            );
          },
        },
      ]);
      // if (accept) {
      //   hubConnection.invoke(
      //     "AcceptConnectionRequest",
      //     fromUserId,
      //     "yourUserId"
      //   );
      // } else {
      //   // Gửi từ chối kết nối (tùy chọn)
      //   // hubConnection.invoke('RejectConnectionRequest', fromUserId, 'yourUserId');
      // }
    });

    hubConnection.on("NoConnectionsAvailable", (toUserId) => {
      ToastAndroid.show(
        `Hiện không thể kết nối với ${toUserId}`,
        ToastAndroid.SHORT
      );
      setWaitingConnect(false);
    });

    hubConnection.on("ConnectionRefused", (fromUserId) => {
      ToastAndroid.show(`${fromUserId} từ chối kết nối`, ToastAndroid.SHORT);
      setWaitingConnect(false);
    });

    hubConnection.on("ConnectionAccepted", async (toUserId) => {
      setWaitingConnect(false);
      setModeTogether(true);
      cancelSound();
      await dispatch(
        getUserByUsername({
          username: toUserId,
        })
      ).then(() => {
        navigation.navigate("RoomTogether", { data: toUserId });
      });
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const updateDataUserListConnected = async () => {
        const a = JSON.parse(await AsyncStorage.getItem("userListConnected"));
        setUserListConnected(a);
      };
      updateDataUserListConnected();
      return () => {
        // console.log("ScreenA unfocused");
      };
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "rgb(15,15,15)",
        }}
      >
        <TextInput
          style={{
            width: 250,
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "white",
            paddingLeft: 15,
            marginTop: 20,
            color: "white",
          }}
          placeholderTextColor="#A3A1A2"
          placeholder="Kết nối với..."
          selectionColor={"#F57C1F"}
          onChangeText={(idConnect) => setIdConnect(idConnect)}
        />

        <TouchableOpacity
          onPress={() => {
            hubConnection.invoke(
              "SendConnectionRequest",
              userInfo.username,
              idConnect
            );
            setWaitingConnect(true);
            Keyboard.dismiss();
          }}
          style={{
            width: 250,
            marginTop: 25,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            backgroundColor: "#F57C1F",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Connect
          </Text>
        </TouchableOpacity>

        {userListConnected ? (
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                marginLeft: 20,
                marginTop: 25,
                fontWeight: "bold",
              }}
            >
              Kết nối gần đây
            </Text>
            <FlatList
              data={userListConnected}
              keyExtractor={(item) => item.username}
              renderItem={renderItemAuthor}
              extraData={userListConnected}
              style={{ paddingHorizontal: 0 }}
              initialNumToRender={3}
            />
          </View>
        ) : (
          <></>
        )}

        {waitingConnect ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ marginBottom: 40, fontSize: 20, color: "white" }}
            >{`Đang kết nối với ${idConnect}`}</Text>
            <ActivityIndicator size="large" color="#F57C1F" />
            <TouchableOpacity
              onPressOut={() => {
                setWaitingConnect(false);
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: "lightblue",
                  marginTop: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Hủy</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
