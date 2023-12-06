import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CardSongForStorage from "../components/CardSongForStorage";
import { Updated } from "../redux/storageSlice";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAudio } from "../common/AudioProvider";

export default function ManageStorage({}) {
  const { playRandomTrackList, playTrackList } = useAudio();
  const [data, setData] = useState([]);
  const { width } = Dimensions.get("window");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const storageRedux = useSelector((state) => state.storageRedux);
  const lottieEmptyRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("new");
  const [items, setItems] = useState([
    { label: "Mới nhất", value: "new" },
    { label: "Cũ nhất", value: "old" },
    { label: "Tên(A-Z)", value: "az" },
    { label: "Tên(Z-A)", value: "za" },
  ]);
  const getDownloadedSongs = async (typeOrder) => {
    try {
      const downloadedSongs = await AsyncStorage.getItem("downloadedSongs");
      const parsedDownloadedSongs = JSON.parse(downloadedSongs);
      if (parsedDownloadedSongs && parsedDownloadedSongs.length > 0) {
        setIsEmpty(false);
        switch (typeOrder) {
          case "new":
            // Sắp xếp theo thời gian mới nhất
            parsedDownloadedSongs.sort((a, b) => b.timestamp - a.timestamp);
            break;
          case "old":
            // Sắp xếp theo thời gian cũ nhất
            parsedDownloadedSongs.sort((a, b) => a.timestamp - b.timestamp);
            break;
          case "az":
            // Sắp xếp theo tên từ a đến z
            parsedDownloadedSongs.sort((a, b) =>
              a.nameSong.localeCompare(b.nameSong)
            );
            break;
          case "za":
            // Sắp xếp theo tên từ z đến a
            parsedDownloadedSongs.sort((a, b) =>
              b.nameSong.localeCompare(a.nameSong)
            );
            break;
          default:
          // Xử lý khi typeOrder không khớp với bất kỳ trường hợp nào
        }

        setData(parsedDownloadedSongs);
      } else {
        setIsEmpty(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ AsyncStorage:", error);
    }
  };
  useEffect(() => {
    getDownloadedSongs(value);
  }, [value]);

  useEffect(() => {
    getDownloadedSongs();
  }, [storageRedux]);

  useEffect(() => {
    if (isEmpty && lottieEmptyRef) {
      lottieEmptyRef.current.play();
    }
  }, [isEmpty]);

  const renderItem = ({ item }) => {
    return <CardSongForStorage props={{ ...item }}></CardSongForStorage>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "rgb(15,15,15)",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 6,
            paddingTop: 6,
            paddingBottom: 12,
          }}
        >
          <Ionicons name="chevron-back-outline" size={36} color="#F57C1F" />

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "#F57C1F",
              paddingLeft: 6,
            }}
          >
            Kho lưu trữ
          </Text>
        </TouchableOpacity>

        {isEmpty ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
          <>
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <View
                style={{
                  width: width,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  onPressOut={() => {
                    playTrackList(data);
                  }}
                  style={{
                    width: 150,
                    height: 35,
                    backgroundColor: "#F57C1F",
                    borderRadius: 150,
                    paddingVertical: 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" color="white" size={26}></Ionicons>
                  <Text
                    style={{
                      color: "white",
                      marginLeft: 8,
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    Phát tất cả
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPressOut={() => {
                    playRandomTrackList(data);
                  }}
                  style={{
                    width: 150,
                    height: 35,
                    backgroundColor: "#393D3E",
                    borderRadius: 150,
                    paddingVertical: 2,
                    paddingHorizontal: 25,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="shuffle-outline"
                    color="white"
                    size={26}
                  ></Ionicons>
                  <Text
                    style={{
                      color: "white",
                      marginLeft: 8,
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    Trộn bài
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View
                style={{
                  alignItems: "flex-end",
                  flexDirection: "row-reverse",
                  zIndex: 2,
                }}
              >
                {/* <Menu
                renderer={Popover}
                rendererProps={{ placement: "top" }}
                style={{ width: "auto", height: "auto", borderRadius: 5 }}
              >
                <MenuTrigger
                  style={{ width: "auto", height: "auto" }}
                  customStyles={{
                    triggerWrapper: {},
                  }}
                >
                  <Ionicons name="ellipsis-vertical-outline" size={32} />
                </MenuTrigger>
                <MenuOptions customStyles={optionsStyles}>
                  <MenuOption
                    onSelect={() => {
                      alert("download");
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ paddingRight: 15 }}>Tải xuống</Text>
                    <Ionicons name="cloud-download-outline" size={32} />
                  </MenuOption>
                  <MenuOption onSelect={() => alert(`Save`)} text="Save" />
                  <MenuOption onSelect={() => alert(`Delete`)} text="Delete" />
                </MenuOptions>
              </Menu> */}
                <View
                  style={{
                    width: 130,
                    borderRadius: 0,
                    borderWidth: 0,
                    alignItems: "flex-end",
                    marginRight: 10,
                  }}
                >
                  {/* <DropDownPicker
                    style={{
                      borderRadius: 0,
                      borderWidth: 0,
                    }}
                    mode="BADGE"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                  /> */}
                </View>
              </View>

              <View style={{ padding: 10, marginTop: 10 }}>
                <FlatList
                  data={data}
                  onDragEnd={({ data }) => setData(data)}
                  keyExtractor={(item) => item.linkSong}
                  renderItem={renderItem}
                  style={{ paddingHorizontal: 0 }}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 10,
  },
  optionsWrapper: {},
  optionWrapper: {
    backgroundColor: "yellow",
    margin: 5,
  },
  optionTouchable: {
    underlayColor: "green",
    activeOpacity: 70,
  },
  optionText: {},
};
