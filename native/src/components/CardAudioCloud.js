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
import Icon from "react-native-vector-icons/FontAwesome";
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
import { deleteFileFromFirebase, pickImage } from "../ultis/FileHelper";
export default function CardAudioCloud({ props }) {
  const { width, height } = Dimensions.get("window");
  const userInfoRedux = useSelector((state) => state.userInfo);

  const [modalVisible, setModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState(props.img);
  const [name, setName] = useState(props.nameSong);
  const [isChanged, setIsChanged] = useState(false);
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

  const removeFromCloud = async (props) => {
    deleteFileFromFirebase(props, dispatch, userInfoRedux.token);
  };

  useEffect(() => {
    if (
      (props.access === "public") !== isPublic ||
      props.img !== image ||
      props.nameSong !== name
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [image, isPublic, name]);
  return (
    <View
      style={{
        width: "94%",
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingVertical: 5,
          overflow: "visible",
          backgroundColor: "rgb(15,15,15)",
          borderRadius: 5,
        }}
      >
        <TouchableOpacity delayPressIn={1000} style={{ flexDirection: "row" }}>
          <Image
            style={{
              resizeMode: "cover",
              width: 50,
              height: 50,
              borderRadius: 5,
              zIndex: 2,
            }}
            source={
              props.img === null || props.img === "" || props.img === "null"
                ? require("../../assets/unknow.jpg")
                : { uri: props.img }
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
              style={{ fontWeight: "bold", color: "white" }}
            >
              {props.nameSong}
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
                  color: "#A3A1A2",
                  fontSize: 12,
                  marginRight: 5,
                }}
              >
                {props.access === "public" ? "Công khai" : "Riêng tư"}
              </Text>

              {props.access === "public" ? (
                <Ionicons name="earth-outline" color="#A3A1A2" size={16} />
              ) : (
                <Ionicons name="lock-closed-outline" color="#A3A1A2" size={16} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "flex-end",
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
              color="#A3A1A2"
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
                backgroundColor: "rgb(50,50,50)",
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
                  backgroundColor: "white",
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
                    image === null || image === "" || image === "null"
                      ? require("../../assets/unknow.jpg")
                      : { uri: image }
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
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    {props.nameSong}
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
                        color: "#A3A1A2",
                        fontSize: 12,
                        marginRight: 5,
                      }}
                    >
                      {props.access === "public" ? "Công khai" : "Riêng tư"}
                    </Text>

                    {props.access === "public" ? (
                      <Ionicons name="earth-outline" color="#A3A1A2" size={16} />
                    ) : (
                      <Ionicons name="lock-closed-outline" color="#A3A1A2" size={16} />
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
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 5,
                    }}
                  >
                    <Ionicons color="white" name="download-outline" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "white",
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
                      color="white"
                      name="musical-notes-outline"
                      size={30}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "white",
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
                      <Ionicons name="earth-outline" color="white" size={30} />
                    ) : (
                      <Ionicons name="lock-closed-outline" color="white" size={30} />
                    )}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "white",
                        marginLeft: 15,
                      }}
                    >
                      {props.access === "public" ? "Công khai" : "Riêng tư"}
                    </Text>

                    <Switch
                      style={{ alignSelf: "flex-end", flexGrow: 1 }}
                      value={isPublic}
                      onValueChange={(newValue) => {}}
                      trackColor={{ false: "gray", true: "#00B6FF" }}
                      thumbColor={isPublic ? "white" : "#333"}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPressOut={() => {
                    removeFromCloud(props);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <Ionicons color="red" name="trash-outline" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "red",
                        marginLeft: 15,
                      }}
                    >
                      Xóa khỏi Cloud
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    display: isChanged ? "flex" : "none",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <Ionicons color="#00A9FF" name="save" size={30} />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "#00A9FF",
                        marginLeft: 15,
                      }}
                    >
                      Lưu thay đổi
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
