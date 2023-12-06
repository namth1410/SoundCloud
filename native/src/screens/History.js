import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CardSongForHistory from "../components/CardSongForHistory";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dialog } from "@rneui/themed";
import { deleteHistoryAllAsync } from "../redux/historySlice";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-virtualized-view";

export default function History({}) {
  const dispatch = useDispatch();
  const userInfoRedux = useSelector((state) => state.userInfo);
  const historyRedux = useSelector((state) => state.historyRedux);
  const [data, setData] = useState(historyRedux.historyList);
  const [visibleDialog, setVisibleDialog] = useState(false);

  const lottieEmptyRef = useRef(null);

  const toggleDialog = () => {
    setVisibleDialog(!visibleDialog);
  };

  const clearHistory = () => {
    dispatch(deleteHistoryAllAsync({ token: userInfoRedux.token }));
    toggleDialog();
    ToastAndroid.show(`Đã xóa`, ToastAndroid.SHORT);
  };

  const renderItem = ({ item }) => {
    return <CardSongForHistory props={{ ...item }}></CardSongForHistory>;
  };

  useEffect(() => {
    setData(historyRedux.historyList);
    if (historyRedux.historyList.length === 0 && lottieEmptyRef) {
      lottieEmptyRef.current.play();
    }
  }, [historyRedux.historyList]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "rgb(15,15,15)",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#F57C1F",
            paddingLeft: 12,
            paddingTop: 6,
            paddingBottom: 12,
          }}
        >
          Lịch sử nghe
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (historyRedux.historyList.length > 0) {
              toggleDialog();
            }
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            style={{ marginRight: 15 }}
            name="trash-outline"
            color="gray"
            size={26}
          />
        </TouchableOpacity>
      </View>

      {historyRedux.historyList.length === 0 ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgb(15,15,15)",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 26,
              color: "white",
              transform: [{ translateY: -150 }],
            }}
          >
            Không có lịch sử
          </Text>
          <LottieView
            style={{
              width: 200,
              height: 200,
              transform: [{ translateY: -50 }],
            }}
            ref={lottieEmptyRef}
            source={require("../../assets/empty.json")}
            renderMode={"SOFTWARE"}
            loop={true}
          />
        </View>
      ) : (
        <ScrollView
          style={{
            backgroundColor: "rgb(15,15,15)",
            flex: 1,
          }}
        >
          <View style={{ padding: 10 }}>
            <FlatList
              data={data}
              onDragEnd={({ data }) => setData(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              style={{ paddingHorizontal: 0 }}
            />
          </View>
        </ScrollView>
      )}

      <Dialog isVisible={visibleDialog} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Xóa lịch sử nghe" />
        <Text>Bạn chắc chắn muốn xóa toàn bộ lịch sử ?</Text>
        <Dialog.Actions>
          <Dialog.Button
            titleStyle={{ color: "red" }}
            title="Xóa"
            onPress={() => clearHistory()}
          />
          <Dialog.Button title="Hủy" onPress={() => toggleDialog()} />
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}
