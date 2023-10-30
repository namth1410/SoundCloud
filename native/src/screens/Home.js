import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PlayList from "../components/PlayList";
import { getHistoryList } from "../redux/historySlice";
import { getPlaylists } from "../redux/playlistSlice";
import { getSongLikeList } from "../redux/songLikeSlice";
import { fakeDataSuggestSongList } from "../redux/suggestSongSlice";
export default function Home({}) {
  const allSong = useSelector((state) => state.allSong);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    if (userInfo.token) {
      dispatch(getSongLikeList({ token: userInfo.token }));
      dispatch(getHistoryList({ token: userInfo.token }));
      dispatch(getPlaylists({ token: userInfo.token }));
    }
  }, []);

  useEffect(() => {
    dispatch(fakeDataSuggestSongList([]));
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Author");
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
            {`Home`}
          </Text>
        </TouchableOpacity>
        {/* <DoubleTap
          onPress={() => {
            console.log("double");
          }} // Handler after double tap on button
          delay={500} // Delay between tapas
          component={TouchableOpacity} // Custom component with onPress (default: TouchableOpacity)
        >
          <Text>Click me pls!</Text>
        </DoubleTap> */}

        <ScrollView>
          <PlayList
            props={{
              title: "Nghe gần đây",
              playList: allSong.songs,
              label: "",
            }}
          ></PlayList>
          <PlayList
            props={{ title: "Thịnh hành", playList: [1, 2, 3] }}
          ></PlayList>
          <PlayList
            props={{ title: "Top 100", playList: [1, 2, 3] }}
          ></PlayList>
        </ScrollView>
      </View>
      {/* {playSongStore.infoSong.nameSong ? <ControlSong></ControlSong> : <></>} */}
    </SafeAreaView>
  );
}
