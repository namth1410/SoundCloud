import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAY_MODE } from "../redux/configAudioSlice";
import { playSong } from "../redux/playSongSlice";
import {
  fakeDataSuggestSongList,
  updateDataSuggestSongList,
} from "../redux/suggestSongSlice";

const AudioContext = createContext({
  playSound: () => {},
  pauseSound: () => {},
  continuePlaySound: () => {},
  cancelSound: () => {},
  setPositionAudio: () => {},
  setLoopAudio: () => {},
});

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(new Audio.Sound());
  const configAudio = useSelector((state) => state.configAudio);
  const allSongRedux = useSelector((state) => state.allSong);
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
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
          console.log(suggestSongRedux);
          console.log(suggestSongRedux.suggestSongList);
          console.log(suggestSongRedux.suggestSongList[0]);
          // dispatch(playSong({ ...suggestSongRedux.suggestSongList[0] }));
          // playSound({ uri: suggestSongRedux.suggestSongList[0].linkSong });
          // dispatch(
          //   updateDataSuggestSongList(suggestSongRedux.suggestSongList.slice(1))
          // );
        }
      });
    };

    setupPlaybackStatusListener();
  }, [audio]);

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

    // try {
    //   const checkLoading = await audio.getStatusAsync();
    //   if (checkLoading.isLoaded && checkLoading.isPlaying) {
    //     await audio.pauseAsync();
    //   }
    // } catch (error) {
    //   console.error("Lỗi khi tạm dừng âm thanh:", error);
    // }
  };

  const continuePlaySound = async (source) => {
    audio.playAsync();

    // try {
    //   checkLoading = await audio.getStatusAsync();
    //   if (checkLoading.isLoaded && !checkLoading.isPlaying) {
    //     await audio.playAsync();
    //   }
    // } catch (error) {
    //   console.error("Lỗi khi phát tiếp âm thanh:", error);
    // }
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
      // audio.playFromPositionAsync(value);
    } catch (error) {
      console.error("Lỗi khi tua âm thanh:", error);
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// allowsRecordingIOS: false,
// staysActiveInBackground: true,
// playsInSilentModeIOS: true,
// shouldDuckAndroid: true,
// playThroughEarpieceAndroid: false,
// interruptionModeAndroid: 1,
