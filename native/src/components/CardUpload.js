import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Switch,
  TextInput,
} from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "../common/AudioProvider";
import { getInfoAuthor } from "../redux/authorSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import {
  addSongLike,
  addSongLikeAsync,
  deleteSongLike,
  deleteSongLikeAsync,
} from "../redux/songLikeSlice";

import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import { deleteFile, setUploading, updateFile } from "../redux/uploadSlice";
import { pickImage } from "../ultis/FileHelper";
export default function CardUpload({ props }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChangeNameVisible, setModalChangeNameVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const { width, height } = Dimensions.get("window");
  const userInfoRedux = useSelector((state) => state.userInfo);
  const songLikeRedux = useSelector((state) => state.songLikeRedux);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const uploadRedux = useSelector((state) => state.uploadRedux);
  const [data, setData] = useState(props);
  const [isLiked, setIsLiked] = useState(false);
  const [isPublic, setIsPublic] = useState(props.access === "public");
  const [name, setName] = useState(props.assets[0].name);
  const [image, setImage] = useState(props.image);
  const lottieUploadRef = useRef(null);
  const textInputRef = useRef();

  const { playSound } = useAudio();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          setModalVisible(false);
        }
      },
    })
  ).current;

  const value = new Animated.Value(0);

  const remove = () => {
    dispatch(deleteFile(props));
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();

      if (songLikeRedux.songLikeList) {
        setIsLiked(
          songLikeRedux.songLikeList.some((item) => item.id === props.id)
        );
      }
    }
  }, [modalVisible]);

  useEffect(() => {
    if (uploadRedux.uploadFiles.length === 0) {
      dispatch(setUploading(false));
    }
  }, [uploadRedux]);

  const opacity = value;

  useEffect(() => {
    if (lottieUploadRef.current && props.progress === 0) {
      lottieUploadRef.current.play();
    }
  }, [props]);

  return (
    <View
      style={{
        width: "94%",
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingLeft: 10,
          paddingVertical: 5,
          overflow: "visible",
          backgroundColor: "#B9B4C7",
          borderRadius: 5,
        }}
      >
        <TouchableOpacity style={{ flexDirection: "row" }}>
          <Image
            style={{
              resizeMode: "cover",
              width: 50,
              height: 50,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={
              props.image === null || props.image === ""
                ? require("../../assets/unknow.jpg")
                : { uri: props.image }
            }
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 15,
              width: 0.55 * width,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "bold" }}
            >
              {name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: 12,
                  marginRight: 5,
                }}
              >
                {props.access === "public" ? "Công khai" : "Riêng tư"}
              </Text>

              {props.access === "public" ? (
                <Ionicons name="earth-outline" color="black" size={16} />
              ) : (
                <Ionicons name="lock-closed-outline" size={16} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#000"
              style={{
                textAlignVertical: "center",
              }}
            />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => {
            setModalVisible(false);
          }}
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
                  height: 0.5 * height,
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
                height: 0.5 * height,
                top: 0.5 * height + 20,
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
                <Image
                  style={{
                    resizeMode: "cover",
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    zIndex: 2,
                  }}
                  source={
                    props.image === null || props.image === ""
                      ? require("../../assets/unknow.jpg")
                      : { uri: props.image }
                  }
                />
                <View
                  style={{
                    marginLeft: 15,
                    width: 0.7 * width,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontWeight: "bold" }}
                  >
                    {name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: 12,
                        marginRight: 5,
                      }}
                    >
                      {props.access === "public" ? "Công khai" : "Riêng tư"}
                    </Text>

                    {props.access === "public" ? (
                      <Ionicons name="earth-outline" color="black" size={16} />
                    ) : (
                      <Ionicons name="lock-closed-outline" size={16} />
                    )}
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexGrow: 1,
                  width: "100%",
                  paddingHorizontal: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setModalChangeNameVisible(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 5,
                    }}
                  >
                    <Ionicons color="black" name="download-outline" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "black",
                        marginLeft: 15,
                      }}
                    >
                      Đổi tên
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPressOut={async () => {
                    const a = await pickImage();
                    if (a) {
                      setImage(a.assets[0].uri);
                      dispatch(
                        updateFile({
                          ...props,
                          image: a.assets[0].uri,
                        })
                      );
                    }
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <Ionicons
                      color="black"
                      name="musical-notes-outline"
                      size={30}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "black",
                        marginLeft: 15,
                      }}
                    >
                      Đổi ảnh
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPressOut={() => {
                    handleLike();
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    {props.access === "public" ? (
                      <Ionicons name="earth-outline" color="black" size={30} />
                    ) : (
                      <Ionicons name="lock-closed-outline" size={30} />
                    )}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "black",
                        marginLeft: 15,
                      }}
                    >
                      {props.access === "public" ? "Công khai" : "Riêng tư"}
                    </Text>

                    <Switch
                      style={{ alignSelf: "flex-end", flexGrow: 1 }}
                      value={isPublic}
                      onValueChange={(newValue) => {
                        dispatch(
                          updateFile({
                            ...props,
                            access: newValue ? "public" : "private",
                          })
                        );
                        setIsPublic(newValue);
                      }}
                      trackColor={{ false: "gray", true: "#00B6FF" }}
                      thumbColor={isPublic ? "white" : "#333"}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPressOut={() => {
                    remove();
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <Ionicons color="black" name="trash-outline" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "black",
                        marginLeft: 15,
                      }}
                    >
                      Xóa khỏi danh sách
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={modalChangeNameVisible}
          animationType="fade"
          onRequestClose={() => {
            setModalChangeNameVisible(false);
            textInputRef.current.blur();
          }}
          onShow={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}
        >
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalChangeNameVisible(false);
              }}
            >
              <View
                style={{
                  backgroundColor: "black",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  opacity: 0.5,
                }}
              ></View>
            </TouchableWithoutFeedback>
            <View
              {...panResponder.panHandlers}
              style={{
                width: "100%",
                height: 0.3 * height,
                top: 0.2 * height + 20,
                left: 0,
                position: "absolute",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#F8F0E5",
                  borderRadius: 20,
                  padding: 20,
                  width: "90%",
                  marginVertical: 5,
                  overflow: "visible",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Tên file cũ
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 16, marginTop: 10 }}
                >
                  {name}
                </Text>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "gray",
                    marginTop: 20,
                  }}
                >
                  <TextInput
                    ref={textInputRef}
                    style={{ height: 40, fontSize: 16 }}
                    placeholder="Nhập tên mới"
                    placeholderTextColor="gray"
                    spellCheck={false}
                    onChangeText={(value) => {
                      setTextInputValue(value);
                    }}
                  />
                </View>
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModalChangeNameVisible(false);
                    }}
                  >
                    <Text
                      style={{
                        padding: 7,
                        textAlign: "center",
                        backgroundColor: "gray",
                        color: "white",
                        borderRadius: 100,
                        width: 0.3 * width,
                        fontWeight: "bold",
                        fontSize: 16,
                        textTransform: "uppercase",
                        marginTop: 20,
                      }}
                    >
                      Hủy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPressOut={() => {
                      var _item = JSON.parse(JSON.stringify(props));
                      _item.assets[0].name = textInputValue;
                      dispatch(updateFile(_item));
                      setName(textInputValue);
                      setModalChangeNameVisible(false);
                    }}
                  >
                    <Text
                      style={{
                        padding: 7,
                        textAlign: "center",
                        backgroundColor: "#F57C1F",
                        color: "white",
                        borderRadius: 100,
                        width: 0.3 * width,
                        fontWeight: "bold",
                        fontSize: 16,
                        textTransform: "uppercase",
                        marginTop: 20,
                      }}
                    >
                      Lưu
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View
        style={{
          opacity: 0.8,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "black",
          borderRadius: 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          display: uploadRedux.uploading ? "flex" : "none",
        }}
      >
        <LottieView
          style={{
            width: 60,
            height: 60,
          }}
          ref={lottieUploadRef}
          source={require("../../assets/uploading.json")}
          renderMode={"SOFTWARE"}
          loop={true}
        />
        <Text style={{ color: "#00B6FF", fontWeight: "bold", fontSize: 16 }}>
          {`${parseInt(props.progress)}%`}
        </Text>
      </View>
    </View>
  );
}
