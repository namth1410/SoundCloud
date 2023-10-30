import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CardPlaylist from "../components/CardPlaylist";
import { addPlaylistAsync } from "../redux/playlistSlice";

export default function Playlist({}) {
  const { width, height } = Dimensions.get("window");
  const dispatch = useDispatch();
  const historyRedux = useSelector((state) => state.historyRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const playlistRedux = useSelector((state) => state.playlistRedux);
  const [data, setData] = useState(historyRedux.historyList);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const textInputRef = useRef(null);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onModalShow = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const createNewPlaylist = async () => {
    if (textInputValue === "") {
      ToastAndroid.show("Không để trống", ToastAndroid.SHORT);
    } else {
      await dispatch(
        addPlaylistAsync({
          namePlaylist: textInputValue,
          access: isPublic ? "public" : "private",
          token: userInfoRedux.token,
        })
      ).then((result) => {
        if (result.type.includes("rejected")) {
          if (result.error.message === "Dòng dữ liệu đã tồn tại.") {
            ToastAndroid.show("Playlist đã tồn tại", ToastAndroid.SHORT);
          }
        } else if (result.type.includes("fulfilled")) {
          toggleModal();
          ToastAndroid.show("Đã thêm mới", ToastAndroid.SHORT);
        }
      });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          // Nếu người dùng vuốt xuống hơn 50 pixels, ẩn modal
          setModalVisible(false);
        }
      },
    })
  ).current;

  useEffect(() => {
    setData(playlistRedux.playlistList);
  }, [playlistRedux.playlistList]);

  const renderItem = ({ item }) => {
    return <CardPlaylist props={{ ...item }}></CardPlaylist>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        style="light"
        backgroundColor="#132043"
        color="white"
      ></StatusBar>
      <View
        style={{
          backgroundColor: "#132043",
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
          Playlist
        </Text>

        <View style={{ padding: 10, height: 0.89 * height }}>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "gray",
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 24, color: "white" }}>+</Text>
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 16,
                  color: "white",
                }}
              >
                Tạo playlist
              </Text>
            </View>
          </TouchableOpacity>

          <FlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            extraData={data}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          textInputRef.current.blur();
        }}
        onShow={onModalShow}
      >
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                width: "100%",
                height: 0.2 * height,
                top: 0,
                left: 0,
                opacity: 0,
              }}
            ></View>
          </TouchableWithoutFeedback>
          <View
            {...panResponder.panHandlers}
            style={{
              backgroundColor: "#F8F0E5",
              width: "100%",
              height: 0.8 * height,
              top: 0.2 * height + 20,
              left: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              position: "absolute",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 0.2 * width,
                height: 3,
                backgroundColor: "#000",
                marginTop: 5,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                paddingTop: 5,
                paddingBottom: 10,
                marginVertical: 5,
                overflow: "visible",
                borderBottomWidth: 1,
                borderBottomColor: "grey",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Tạo playlist mới
              </Text>
            </View>

            <View
              style={{
                flexGrow: 1,
                width: "100%",
                paddingHorizontal: 10,
              }}
            >
              <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  Tên playlist
                </Text>
                <View style={{ borderBottomWidth: 1, borderColor: "gray" }}>
                  <TextInput
                    ref={textInputRef}
                    style={{ height: 40, fontSize: 16 }}
                    placeholder="Nhập tên playlist"
                    placeholderTextColor="gray"
                    spellCheck={false}
                    onChangeText={(value) => {
                      setTextInputValue(value);
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Text style={{ flex: 1, fontSize: 16 }}>Công khai</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Switch
                    value={isPublic}
                    onValueChange={(newValue) => setIsPublic(newValue)}
                    trackColor={{ false: "gray", true: "#F57C1F" }}
                    thumbColor={isPublic ? "white" : "#333"}
                  />
                </View>
              </View>

              <View style={{ alignItems: "center", marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    createNewPlaylist();
                  }}
                >
                  <Text
                    style={{
                      padding: 7,
                      textAlign: "center",
                      backgroundColor: "#F57C1F",
                      color: "white",
                      borderRadius: 100,
                      width: 0.6 * width,
                      fontWeight: "bold",
                      fontSize: 16,
                      textTransform: "uppercase",
                      marginTop: 20,
                    }}
                  >
                    Tạo playlist
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {playlistRedux.loading ? (
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
    </SafeAreaView>
  );
}
