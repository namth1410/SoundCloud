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
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CardSongForStorage from "../components/CardSongForStorage";
import { Updated } from "../redux/storageSlice";
import LottieView from "lottie-react-native";
import CardAudioCloud from "../components/CardAudioCloud";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useAudio } from "../common/AudioProvider";

export default function AudioCloud({}) {
  const { playRandomTrackList, playTrackList } = useAudio();
  const [data, setData] = useState();
  const { width } = Dimensions.get("window");
  const dispatch = useDispatch();
  const audioCloudRedux = useSelector((state) => state.audioCloudRedux);
  const navigation = useNavigation();
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
  const getDownloadedSongs = (typeOrder) => {
    try {
      let audioCloud = [...audioCloudRedux.audioCloud];
      if (audioCloud.length > 0) {
        setIsEmpty(false);
        switch (typeOrder) {
          case "new":
            // Sắp xếp theo thời gian mới nhất
            audioCloud.sort((a, b) => b.id - a.id);
            break;
          case "old":
            // Sắp xếp theo thời gian cũ nhất
            audioCloud.sort((a, b) => a.id - b.id);
            break;
          case "az":
            // Sắp xếp theo tên từ a đến z
            audioCloud.sort((a, b) => a.nameSong.localeCompare(b.nameSong));
            break;
          case "za":
            // Sắp xếp theo tên từ z đến a
            audioCloud.sort((a, b) => b.nameSong.localeCompare(a.nameSong));
            break;
          default:
          // Xử lý khi typeOrder không khớp với bất kỳ trường hợp nào
        }

        setData(audioCloud);
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
    if (isEmpty && lottieEmptyRef) {
      lottieEmptyRef.current.play();
    }
  }, [isEmpty]);

  const renderItem = ({ item }) => {
    return <CardAudioCloud props={{ ...item }}></CardAudioCloud>;
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
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 6,
            paddingTop: 6,
            paddingBottom: 12,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          {/* <Ionicons name="chevron-back-outline" size={36} color="#F57C1F" /> */}

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "#F57C1F",
              paddingLeft: 6,
            }}
          >
            Các bài hát đã tải lên
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
                <View
                  style={{
                    width: 130,
                    borderRadius: 0,
                    borderWidth: 0,
                    alignItems: "flex-end",
                    marginRight: 10,
                  }}
                >
                  <View
                    style={{
                      marginLeft: 0,
                      marginVertical: 15,
                      width: width - 20,
                    }}
                  >
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setValue("new");
                        }}
                        style={{
                          flexDirection: "row",
                          backgroundColor:
                            value === "new" ? "white" : "#272727",
                          borderRadius: 500,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: value === "new" ? "black" : "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Mới nhất
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setValue("old");
                        }}
                        style={{
                          flexDirection: "row",
                          backgroundColor:
                            value === "old" ? "white" : "#272727",
                          borderRadius: 500,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: value === "old" ? "black" : "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Cũ nhất
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setValue("az");
                        }}
                        style={{
                          flexDirection: "row",
                          backgroundColor: value === "az" ? "white" : "#272727",
                          borderRadius: 500,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: value === "az" ? "black" : "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Tên (A-Z)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setValue("za");
                        }}
                        style={{
                          flexDirection: "row",
                          backgroundColor: value === "za" ? "white" : "#272727",
                          borderRadius: 500,
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: value === "za" ? "black" : "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Tên (Z-A)
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View style={{ padding: 10, height: "83%" }}>
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
