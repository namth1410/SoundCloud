import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import {
  pickAndConfigureFile,
  uploadFileToFirebase,
  uploadFileToFirebaseV2,
  uploadFileToFirebaseV3,
} from "../ultis/FileHelper";
import CardUpload from "../components/CardUpload";
import { useDispatch, useSelector } from "react-redux";
import { addFile, setUploading } from "../redux/uploadSlice";

export default function UploadFromUser({ navigation }) {
  const dispatch = useDispatch();
  const uploadRedux = useSelector((state) => state.uploadRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
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
    dispatch(setUploading(true));
    for (let i = data.length - 1; i >= 0; i--) {
      uploadFileToFirebaseV3(data[i], dispatch, userInfoRedux.token);
    }

    // await uploadFileToFirebaseV2(data[0]);
    console.log("xong ham");
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
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
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
          Upload và phát hành
        </Text>

        <View style={{ padding: 10, alignItems: "center" }}>
          <TouchableOpacity
            onPressOut={() => {
              handleUploadFromDevice();
            }}
            style={{
              width: "95%",
              height: 150,
              borderRadius: 10,
              backgroundColor: "#E7CBCB",
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
            <Text
              style={{ color: "#00B6FF", fontWeight: "bold", fontSize: 16 }}
            >
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
                Upload
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "95%",
              height: "auto",
              maxHeight: 300,
              borderRadius: 10,
              backgroundColor: "#E7CBCB",
              marginTop: 15,
              display: data.length > 0 ? "flex" : "none",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, padding: 5 }}>
              Chuẩn bị tải lên
            </Text>
            <FlatList
              data={data}
              onDragEnd={({ data }) => setData(data)}
              keyExtractor={(item) => item.assets[0].uri}
              renderItem={renderItem}
              style={{ paddingHorizontal: 0, marginTop: 10 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
