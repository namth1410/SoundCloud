import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAY_MODE } from "../redux/configAudioSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
import { playSong } from "../redux/playSongSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ToastAndroid } from "react-native";
import { storage } from "../api/firebase";
import {
  Updated,
  addStorage,
  deleteSongFromStorage,
  removeQueue,
  updateProgress,
} from "../redux/storageSlice";

const AudioContext = createContext({
  setModeTogether: () => {},
  playSound: () => {},
  pauseSound: () => {},
  continuePlaySound: () => {},
  cancelSound: () => {},
  setPositionAudio: () => {},
  setLoopAudio: () => {},
  downloadFromUrl: () => {},
  removeSongFromStorage: () => {},
  addSongToNextPlay: () => {},
  playNextTrack: () => {},
  playPreTrack: () => {},
  playRandomTrackList: () => {},
  playTrackList: () => {},
});

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(new Audio.Sound());
  const configAudio = useSelector((state) => state.configAudio);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const historyRedux = useSelector((state) => state.historyRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const storageRedux = useSelector((state) => state.storageRedux);
  const allSong = useSelector((state) => state.allSong);
  const playSongStore = useSelector((state) => state.playSongRedux);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0);
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(false);
  const [modeTogether, setModeTogether] = useState(false);

  useEffect(() => {
    const pre = async () => {
      await Audio.setIsEnabledAsync(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeAndroid: 1,
      });
    };

    pre();
  }, []);

  useEffect(() => {
    if (audio._loaded) {
      if (configAudio.playMode === PLAY_MODE.LOOP) {
        audio.setIsLoopingAsync(true);
      } else {
        audio.setIsLoopingAsync(false);
      }
    }
  }, [configAudio.playMode]);

  useEffect(() => {
    let newSuggestSongList = [...suggestSongRedux.suggestSongList];

    if (suggestSongRedux.suggestSongList.length !== 12) {
      const allSongs = allSong.songs;
      while (newSuggestSongList.length < 12) {
        const randomIndex = Math.floor(Math.random() * allSongs.length);
        const randomSong = allSongs[randomIndex];

        if (
          !newSuggestSongList.some(
            (song) =>
              song.id === randomSong.id ||
              randomSong.id === playSongStore.infoSong.id
          )
        ) {
          newSuggestSongList.push(randomSong);
        }
      }

      dispatch(updateDataSuggestSongList(newSuggestSongList));
    }
  }, [playSongStore]);

  const playSound = async (item, recordHistory = true) => {
    try {
      dispatch(playSong(item));

      let checkLoading = await audio.getStatusAsync();
      if (checkLoading.isLoaded) {
        await audio.unloadAsync();
        await audio.loadAsync({ uri: item.linkSong });
        audio.playAsync();
        checkLoading = await audio.getStatusAsync();
        setDuration(checkLoading.durationMillis);
      } else {
        await audio.loadAsync({ uri: item.linkSong });
        audio.playAsync();
        checkLoading = await audio.getStatusAsync();
        setDuration(checkLoading.durationMillis);
      }
      setPlaying(true);
      if (recordHistory) {
        dispatch(addHistoryAsync({ ...item, token: userInfoRedux.token }));
      }
      const setupPlaybackStatusListener = async () => {
        audio.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded) {
            // setPlaying(true);
          }

          if (status.isPlaying) {
            const currentTime = status.positionMillis;
            setCurTime(currentTime);
            // setPlaying(true);
          } else if (!status.isPlaying) {
            // setPlaying(false);
          }

          // phát bài hát kế tiếp
          if (
            status.didJustFinish &&
            status.isLoaded &&
            configAudio.playMode !== PLAY_MODE.LOOP
          ) {
            let index = 0;
            if (configAudio.playMode === PLAY_MODE.RANDOM) {
              index = Math.floor(
                Math.random() * suggestSongRedux.suggestSongList.length
              );
            }
            playSound(suggestSongRedux.suggestSongList[index]);
            dispatch(playSong({ ...suggestSongRedux.suggestSongList[index] }));
            dispatch(
              addHistoryAsync({
                ...suggestSongRedux.suggestSongList[index],
                token: userInfoRedux.token,
              })
            );
            dispatch(
              updateDataSuggestSongList(
                suggestSongRedux.suggestSongList.slice(1)
              )
            );
          }
        });
      };

      // setupPlaybackStatusListener();
      await AsyncStorage.setItem("playSongLasted", JSON.stringify(item));
    } catch (error) {
      console.error("Lỗi khi tải âm thanh provider:", error);
    }
  };

  const pauseSound = async () => {
    setPlaying(false);
    audio.pauseAsync();
  };

  const continuePlaySound = async (source) => {
    setPlaying(true);
    audio.playAsync();
  };

  const cancelSound = async () => {
    try {
      await audio.unloadAsync();
    } catch (error) {
      console.error("Lỗi khi dừng âm thanh:", error);
    }
  };

  const setPositionAudio = async (value) => {
    try {
      audio.setPositionAsync(value);
    } catch (error) {
      console.error("Lỗi khi tua âm thanh:", error);
    }
  };

  const downloadFromUrl = async (infoSong) => {
    const downloadedSongs = await AsyncStorage.getItem("downloadedSongs");
    let downloadedSongsArray = [];
    if (downloadedSongs) {
      downloadedSongsArray = JSON.parse(downloadedSongs);
    }
    const isSongAlreadyDownloaded = downloadedSongsArray.some(
      (song) => song.linkSong === infoSong.linkSong
    );

    if (!isSongAlreadyDownloaded) {
      const downloadResumable = FileSystem.createDownloadResumable(
        infoSong.linkSong,
        FileSystem.documentDirectory + infoSong.nameSong,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          console.log(`${progress * 100}%`);
        }
      );

      try {
        const result = await downloadResumable.downloadAsync();

        const downloadedSongs = await getDownloadedSongs();

        const _n = {
          ...infoSong,
          urlLocal: result.uri,
          timestamp: new Date().getTime(),
        };
        downloadedSongs.push(_n);

        await saveDownloadedSongs(downloadedSongs);
        dispatch(addStorage(_n));
        dispatch(removeQueue(infoSong));

        ToastAndroid.show(`Download done`, ToastAndroid.SHORT);
      } catch (e) {
        console.error("Lỗi tải xuống:", e);
      }
    } else {
      console.log(`Bài hát "${infoSong.nameSong}" đã được tải xuống trước đó.`);
    }
  };

  // Hàm để lấy danh sách bài hát đã tải về
  const getDownloadedSongs = async () => {
    try {
      const value = await AsyncStorage.getItem("downloadedSongs");
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài hát đã tải về:", error);
      return [];
    }
  };

  // Hàm để lưu danh sách bài hát đã tải về
  const saveDownloadedSongs = async (songs) => {
    try {
      await AsyncStorage.setItem("downloadedSongs", JSON.stringify(songs));
    } catch (error) {
      console.error("Lỗi khi lưu danh sách bài hát đã tải về:", error);
    }
  };

  const removeSongFromStorage = async (songToDelete) => {
    try {
      const downloadedSongs = await getDownloadedSongs();
      const updatedSongs = downloadedSongs.filter(
        (song) => song.linkSong !== songToDelete.linkSong
      );

      await saveDownloadedSongs(updatedSongs);
      dispatch(deleteSongFromStorage(songToDelete));
      ToastAndroid.show(`Xóa thành công`, ToastAndroid.SHORT);

      return updatedSongs;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát đã tải về:", error);
      return null;
    }
  };

  const addSongToNextPlay = async (song) => {
    if (suggestSongRedux.suggestSongList.length === 0) {
      playSound(song);
    }
  };

  const playNextTrack = () => {
    playSound(suggestSongRedux.suggestSongList[0]);
    dispatch(
      updateDataSuggestSongList(suggestSongRedux.suggestSongList.slice(1))
    );
  };

  const playPreTrack = () => {
    let index = historyRedux.historyList.findIndex((element, index) => {
      return element.id === playSongStore.infoSong.id;
    });

    for (let i = 0; i < historyRedux.historyList.length; i++) {
      if (
        i > index &&
        historyRedux.historyList[i].id !== playSongStore.infoSong.id
      ) {
        index = i;
        break;
      }
    }
    playSound(historyRedux.historyList[index], (recordHistory = false));

    const newSuggestSongList = [
      playSongStore.infoSong,
      ...suggestSongRedux.suggestSongList.filter(
        (song) => song.id !== playSongStore.infoSong.id
      ),
    ];
    dispatch(updateDataSuggestSongList(newSuggestSongList));
    dispatch(playSong(historyRedux.historyList[index]));
  };

  const playRandomTrackList = (trackList) => {
    const shuffledTrackList = [...trackList].sort(() => Math.random() - 0.5);
    playSound(shuffledTrackList[0]);
    dispatch(updateDataSuggestSongList(shuffledTrackList.slice(1)));
  };

  const playTrackList = (trackList) => {
    playSound(trackList[0]);
    dispatch(updateDataSuggestSongList(trackList.slice(1)));
  };

  return (
    <AudioContext.Provider
      value={{
        duration,
        curTime,
        playing,
        modeTogether,
        setModeTogether,
        playSound,
        pauseSound,
        continuePlaySound,
        cancelSound,
        setPositionAudio,
        downloadFromUrl,
        removeSongFromStorage,
        addSongToNextPlay,
        playNextTrack,
        playPreTrack,
        playRandomTrackList,
        playTrackList,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
