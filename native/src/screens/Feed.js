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
  BackHandler
} from "react-native";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { BASE_URL } from "../redux/configAPI";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getUserByUsername } from "../redux/userConnectSlice";
import { useAudio } from "../common/AudioProvider";

export const hubConnection = new HubConnectionBuilder()
  .withUrl(`${BASE_URL}/hubs`)
  .configureLogging(LogLevel.Information)
  .build();

export default function Feed({}) {
  const { modeTogether, setModeTogether } = useAudio();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.userInfo);
  const [idConnect, setIdConnect] = useState();
  const [waitingConnect, setWaitingConnect] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (modeTogether) {
        return true;
      } else {
        return false;
      }
    };
    BackHandler.addEventListener('hardwareBackPress', backAction)

    hubConnection
      .start()
      .then(() => {
        hubConnection.invoke("OnConnected", userInfo.username);
        // hubConnection.invoke("ConnectToChat", userInfo.username);
      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
      });

    hubConnection.on("ConnectedToChat", (message) => {
      console.log(message); // In ra thông báo kết nối thành công
      hubConnection.invoke(
        "SendConnectionRequest",
        userInfo.username,
        "userId1"
      );
    });

    hubConnection.on("ConnectionRequest", (fromUserId) => {
      // Hiển thị yêu cầu kết nối và cho phép người dùng đồng ý hoặc từ chối
      // Ví dụ: Hiển thị thông báo hoặc giao diện cho phép người dùng xác nhận
      console.log("aa");
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

    hubConnection.on("ConnectionRefused", (fromUserId) => {
      ToastAndroid.show(`${fromUserId} từ chối kết nối`, ToastAndroid.SHORT);
      setWaitingConnect(false);
    });

    hubConnection.on("ConnectionAccepted", async (toUserId) => {
      setWaitingConnect(false);
      setModeTogether(true);
      await dispatch(
        getUserByUsername({
          username: toUserId,
        })
      ).then(() => {
        navigation.navigate("RoomTogether", { data: toUserId });
      });

      // Xử lý việc kết nối đã được chấp nhận
      // Ví dụ: Hiển thị thông báo hoặc giao diện cho phép người dùng bắt đầu trò chuyện
    });
  }, []);
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
