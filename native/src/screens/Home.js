import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import Group from "../components/Group";
import { getHistoryList } from "../redux/historySlice";
import { getPlaylists } from "../redux/playlistSlice";
import { getSongLikeList } from "../redux/songLikeSlice";
import { fakeDataSuggestSongList } from "../redux/suggestSongSlice";
import { GetSongsOfUser } from "../redux/audioCloudSlice";
import { LinearGradient } from "expo-linear-gradient";
import { updateStorage } from "../redux/storageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({}) {
  const allSong = useSelector((state) => state.allSong);
  const userInfo = useSelector((state) => state.userInfo);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const topicType = [
    {
      title: "BXH nhạc mới",
      color1: "#E7CBCB",
      color2: "gray",
    },
    {
      title: "Lofi",
      color1: "#E7CBCB",
      color2: "black",
    },
    {
      title: "Workout",
      color1: "#E7CBCB",
      color2: "blue",
    },
    {
      title: "Halloween",
      color1: "#E7CBCB",
      color2: "green",
    },
    {
      title: "Remix",
      color1: "#E7CBCB",
      color2: "red",
    },
  ];

  useEffect(() => {
    let downloadedSongs = [];
    const getStorage = async () => {
      downloadedSongs =
        JSON.parse(await AsyncStorage.getItem("downloadedSongs")) ?? [];
    };
    getStorage().then(() => {
      if (userInfo.token) {
        dispatch(getSongLikeList({ token: userInfo.token }));
        dispatch(getHistoryList({ token: userInfo.token }));
        dispatch(getPlaylists({ token: userInfo.token }));
        dispatch(GetSongsOfUser({ token: userInfo.token }));
        dispatch(updateStorage(downloadedSongs));
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fakeDataSuggestSongList([]));
  }, []);

  const CardTopicType = (props) => {
    return (
      <View
        style={{
          width: 150,
          height: 80,
          backgroundColor: `${props.props.color2}`,
          borderRadius: 10,
        }}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={[`${props.props.color1}`, "transparent"]}
          style={{
            width: 150,
            height: 80,
            borderRadius: 10,
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: 5,
              marginBottom: 5,
            }}
          >
            {props.props.title}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "rgb(15,15,15)",
          flex: 1,
        }}
      >
        {/* <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor="transparent"
        ></StatusBar> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={async () => {}}>
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
              {`Home`}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              style={{ marginRight: 15 }}
              name="arrow-up-circle-outline"
              color="gray"
              size={26}
            />
            <Ionicons
              style={{ marginRight: 15 }}
              name="notifications-outline"
              color="gray"
              size={26}
            />
          </View>
        </View>

        <ScrollView>
          <Group
            props={{
              title: "Nghe gần đây",
              data: allSong.songs,
              type: "song",
            }}
          ></Group>
          <Group
            props={{
              title: "Mới nhất",
              data: allSong.songs,
              type: "song",
            }}
          ></Group>
          <Group
            props={{
              title: "Có thể bạn muốn nghe",
              data: allSong.songs,
              type: "song",
            }}
          ></Group>
          <Group
            props={{
              title: "Người dùng khác",
              data: allSong.songs,
              type: "author",
            }}
          ></Group>
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 20,
                marginBottom: 15,
                paddingLeft: 12,
              }}
            >
              Chủ đề và thể loại
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 15,
                  paddingLeft: 12,
                }}
              >
                {topicType.map((item, index) => {
                  return (
                    <CardTopicType
                      key={index}
                      props={{ ...item }}
                    ></CardTopicType>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      {/* {playSongStore.infoSong.nameSong ? <ControlSong></ControlSong> : <></>} */}
    </SafeAreaView>
  );
}
