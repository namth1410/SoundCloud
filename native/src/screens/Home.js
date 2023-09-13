import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Button,
  TouchableOpacity,
  TouchableOpacityBase,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import Card from "../components/CardSong";
import PlayList from "../components/PlayList";
import { useSelector, useDispatch } from "react-redux";
import { updateTop100 } from "../redux/userSlice";
import { Audio } from "expo-av";
import { storage } from "../api/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  uploadBytesResumable,
} from "firebase/storage";

export default function Home({ navigation }) {
  const allSong = useSelector((state) => state.allSong);
  const dispatch = useDispatch();

  async function testUpFileMP3() {
    const uri =
      "https://firebasestorage.googleapis.com/v0/b/soundcloud-398901.appspot.com/o/songs%2FC%C3%A1nh%20Thi%E1%BB%87p%20%C4%90%E1%BA%A7u%20Xu%C3%A2n%20%20Ph%C6%B0%C6%A1ng%20Anh%20Official%20MV.mp3?alt=media&token=b8be753b-ab5b-47af-a585-2fed91829ed2";
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob, {
      contentType: "audio/mpeg",
    });

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }
  useEffect(() => {
    console.log(allSong);
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
            dispatch(updateTop100(""));
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

        <ScrollView>
          <PlayList
            props={{ title: "Nghe gần đây", playList: allSong.songs, label: "" }}
          ></PlayList>
          <PlayList
            props={{ title: "Thịnh hành", playList: [1, 2, 3] }}
          ></PlayList>
          <PlayList
            props={{ title: "Top 100", playList: [1, 2, 3] }}
          ></PlayList>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
