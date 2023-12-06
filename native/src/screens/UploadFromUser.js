import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ToastAndroid,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import {
  pickAndConfigureFile,
  uploadFileToFirebaseV3,
} from "../ultis/FileHelper";
import CardUpload from "../components/CardUpload";
import { useDispatch, useSelector } from "react-redux";
import { addFile, setUploading } from "../redux/uploadSlice";
import CardSongSmall from "../components/CardSongSmall";
import CardAudioCloud from "../components/CardAudioCloud";
import { ScrollView } from "react-native-virtualized-view";


export default function UploadFromUser({ navigation }) {
  const dispatch = useDispatch();
  const uploadRedux = useSelector((state) => state.uploadRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const audioCloudRedux = useSelector((state) => state.audioCloudRedux);
  const lottieUploadRef = useRef(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [data, setData] = useState(uploadRedux.uploadFiles);

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <CardUpload props={{ ...item }}></CardUpload>
      </View>
    );
  };

  const handleUploadFromDevice = async () => {
    const a = await pickAndConfigureFile();
    if (a) {
      dispatch(addFile(a));
    }
  };

  const uploadFiletoDatabase = async () => {
    let isValid = true;
    for (let i = data.length - 1; i >= 0; i--) {
      const dataItem = data[i];
      const nameToCheck = dataItem.assets[0].name;

      if (
        audioCloudRedux.audioCloud.find((item) => item.nameSong === nameToCheck)
      ) {
        ToastAndroid.show(`${nameToCheck} đã tồn tại`, ToastAndroid.SHORT);
        isValid = false;
      }
    }
    if (isValid) {
      dispatch(setUploading(true));

      for (let i = data.length - 1; i >= 0; i--) {
        uploadFileToFirebaseV3(data[i], dispatch, userInfoRedux.token);
      }
    }
  };

  useEffect(() => {
    setData(uploadRedux.uploadFiles);
  }, [uploadRedux]);

  useEffect(() => {
    lottieUploadRef.current.play();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 6,
          paddingBottom: 12,
          backgroundColor: "rgb(15,15,15)"
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#F57C1F",
          }}
        >
          Cloud của bạn
        </Text>
      </View>
      <ScrollView
        style={{
          backgroundColor: "rgb(15,15,15)",
          flex: 1,
        }}
      >
        <View style={{ padding: 10, alignItems: "center" }}>
          <TouchableOpacity
            delayPressIn={1000}
            onPressOut={() => {
              handleUploadFromDevice();
            }}
            style={{
              width: "95%",
              height: 150,
              borderRadius: 10,
              backgroundColor: "#292929",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottieView
              style={{
                width: 100,
                height: 100,
                transform: [{ translateY: -5 }],
              }}
              ref={lottieUploadRef}
              source={require("../../assets/upload.json")}
              renderMode={"SOFTWARE"}
              loop={true}
            />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Click để chọn file
            </Text>
          </TouchableOpacity>

          <View
            style={{
              width: "auto",
              height: "auto",
              borderRadius: 10,
              backgroundColor: "#A0E9FF",
              marginTop: 15,
              alignItems: "center",
              display: data.length > 0 ? "flex" : "none",
            }}
          >
            <TouchableOpacity
              onPressOut={() => {
                uploadFiletoDatabase();
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, padding: 10 }}>
                Tải lên
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "95%",
              height: "auto",
              maxHeight: 300,
              borderRadius: 10,
              backgroundColor: "#454545",
              marginTop: 15,
              display: data.length > 0 ? "flex" : "none",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingHorizontal: 8,
                paddingVertical: 3,
                color: "white",
              }}
            >
              Chuẩn bị tải lên
            </Text>
            <FlatList
              nestedScrollEnabled
              data={data}
              onDragEnd={({ data }) => setData(data)}
              keyExtractor={(item) => item.assets[0].uri}
              renderItem={renderItem}
              style={{ paddingHorizontal: 0, marginTop: 5 }}
            />
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 10,
              display:
                audioCloudRedux.audioCloud.length === 0 ? "none" : "flex",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AudioCloud");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
                marginVertical: 5,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
              >
                Các bài hát đã tải lên
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            {audioCloudRedux.audioCloud.slice(0, 3).map((song, index) => (
              <View key={index} style={{}}>
                <CardAudioCloud props={{ ...song }}></CardAudioCloud>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
