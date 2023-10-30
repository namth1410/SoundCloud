import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAY_MODE } from "../redux/configAudioSlice";
import { addHistoryAsync } from "../redux/historySlice";
import { playSong } from "../redux/playSongSlice";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";
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
  playSound: () => {},
  pauseSound: () => {},
  continuePlaySound: () => {},
  cancelSound: () => {},
  setPositionAudio: () => {},
  setLoopAudio: () => {},
  downloadFromUrl: () => {},
  removeSong: () => {},
});

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(new Audio.Sound());
  const configAudio = useSelector((state) => state.configAudio);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const userInfoRedux = useSelector((state) => state.userInfo);
  const storageRedux = useSelector((state) => state.storageRedux);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0);
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(false);

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
    const setupPlaybackStatusListener = async () => {
      audio.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          setPlaying(true);
        }

        if (status.isPlaying) {
          const currentTime = status.positionMillis;
          setCurTime(currentTime);
          setPlaying(true);
        } else if (!status.isPlaying) {
          setPlaying(false);
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
          playSound({ uri: suggestSongRedux.suggestSongList[index].linkSong });
          dispatch(playSong({ ...suggestSongRedux.suggestSongList[index] }));
          dispatch(
            addHistoryAsync({
              ...suggestSongRedux.suggestSongList[index],
              token: userInfoRedux.token,
            })
          );
          dispatch(
            updateDataSuggestSongList(suggestSongRedux.suggestSongList.slice(1))
          );
        }
      });
    };

    setupPlaybackStatusListener();
  }, [audio, suggestSongRedux]);

  const playSound = async (source) => {
    try {
      let checkLoading = await audio.getStatusAsync();

      if (checkLoading.isLoaded) {
        await audio.unloadAsync();
        await audio.loadAsync(source);
        audio.playAsync();
        checkLoading = await audio.getStatusAsync();
        setDuration(checkLoading.durationMillis);
      } else {
        await audio.loadAsync(source);
        audio.playAsync();
        checkLoading = await audio.getStatusAsync();
        setDuration(checkLoading.durationMillis);
      }
    } catch (error) {
      console.error("Lỗi khi tải âm thanh provider:", error);
    }
  };

  const pauseSound = async () => {
    audio.pauseAsync();
  };

  const continuePlaySound = async (source) => {
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

  const removeSong = async (songToDelete) => {
    try {
      // Bước 1: Lấy danh sách bài hát đã tải về từ AsyncStorage
      const downloadedSongs = await getDownloadedSongs();

      // Bước 2: Tìm và xóa bài hát cụ thể khỏi danh sách
      const updatedSongs = downloadedSongs.filter(
        (song) => song.linkSong !== songToDelete.linkSong
      );

      // Bước 3: Lưu danh sách bài hát đã cập nhật lại vào AsyncStorage
      await saveDownloadedSongs(updatedSongs);
      dispatch(deleteSongFromStorage(songToDelete));

      ToastAndroid.show(`Xóa thành công`, ToastAndroid.SHORT);

      // Trả về danh sách bài hát đã cập nhật (tùy theo yêu cầu của bạn)
      return updatedSongs;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát đã tải về:", error);
      return null;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        duration,
        curTime,
        playing,
        playSound,
        pauseSound,
        continuePlaySound,
        cancelSound,
        setPositionAudio,
        downloadFromUrl,
        removeSong,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
