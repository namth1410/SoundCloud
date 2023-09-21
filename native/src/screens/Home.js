import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
import { storage } from "../api/firebase";
import PlayList from "../components/PlayList";

export default function Home({ navigation }) {
  const allSong = useSelector((state) => state.allSong);
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();

  useEffect(() => {
    if (playSongStore.playinng) {

    }
  }, [playSongStore]);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar translucent={false}></StatusBar>
        <TouchableOpacity onPress={() => {}}>
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
      {/* {playSongStore.nameSong ? <ControlSong></ControlSong> : <></>} */}
    </SafeAreaView>
  );
}
