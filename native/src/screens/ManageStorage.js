import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CardSongForStorage from "../components/CardSongForStorage";
import { Updated } from "../redux/storageSlice";

export default function ManageStorage({}) {
  const [data, setData] = useState();
  const { width } = Dimensions.get("window");
  const dispatch = useDispatch();
  const storageRedux = useSelector((state) => state.storageRedux);

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
      if (downloadedSongs) {
        const parsedDownloadedSongs = JSON.parse(downloadedSongs);

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
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ AsyncStorage:", error);
    }
  };
  useEffect(() => {
    getDownloadedSongs(value);
  }, [value]);

  useEffect(() => {
    if (storageRedux.isChanged) {
      getDownloadedSongs();
      dispatch(Updated());
    }
  }, [storageRedux]);

  useEffect(() => {
    if (storageRedux.isChanged) {
      getDownloadedSongs();
      dispatch(Updated());
    }
  }, [storageRedux]);

  const renderItem = ({ item }) => {
    return <CardSongForStorage props={{ ...item }}></CardSongForStorage>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
        <View
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
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity>
            <Text
              style={{
                padding: 5,
                textAlign: "center",
                backgroundColor: "#F57C1F",
                color: "white",
                borderRadius: 100,
                width: 0.6 * width,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Phát ngẫu nhiên
            </Text>
          </TouchableOpacity>
        </View>

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
            <DropDownPicker
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
            />
          </View>
        </View>

        <View style={{ backgroundColor: "yellow", padding: 10 }}>
          <FlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.linkSong}
            renderItem={renderItem}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
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
