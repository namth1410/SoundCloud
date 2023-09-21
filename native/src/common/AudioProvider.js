import React, { createContext, useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { TYPE_ACTION } from "./typeAction";

const AudioContext = createContext({
  playSound: () => {},
  pauseSound: () => {},
  continuePlaySound: () => {},
  cancelSound: () => {},
  test: () => {},
});

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(new Audio.Sound());
  const modalStore = useSelector((state) => state.modal);
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (playSongStore.typeAction === TYPE_ACTION.CHANGE) {
      playSound({ uri: playSongStore.linkSong });
    } else if (playSongStore.typeAction === TYPE_ACTION.PAUSE) {
      pauseSound();
    } else if (playSongStore.typeAction === TYPE_ACTION.CONTINUE) {
      continuePlaySound();
    }
  }, [playSongStore]);

  const test = () => {
    console.log("asd");
  };

  const playSound = async (source) => {
    try {
      await Audio.setIsEnabledAsync(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeAndroid: 1,
      });
      let checkLoading = await audio.getStatusAsync();
      if (checkLoading.isLoaded) {
        await audio.unloadAsync();
      }
      await audio.loadAsync(source);
      checkLoading = await audio.getStatusAsync();
      setDuration(checkLoading.durationMillis);
      console.log("thay doi thoi gian");
      await audio.playAsync();
    } catch (error) {
      console.error("Lỗi khi tải âm thanh provider:", error);
    }
  };

  const pauseSound = async () => {
    try {
      const checkLoading = await audio.getStatusAsync();
      if (checkLoading.isLoaded && checkLoading.isPlaying) {
        await audio.pauseAsync();
      }
    } catch (error) {
      console.error("Lỗi khi tạm dừng âm thanh:", error);
    }
  };

  const continuePlaySound = async (source) => {
    try {
      await Audio.setIsEnabledAsync(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      let checkLoading = await audio.getStatusAsync();
      if (!checkLoading.isLoaded) {
        await audio.loadAsync(source);
      }
      checkLoading = await audio.getStatusAsync();
      if (checkLoading.isLoaded && !checkLoading.isPlaying) {
        await audio.playAsync();
      }
    } catch (error) {
      console.error("Lỗi khi phát tiếp âm thanh:", error);
    }
  };

  const cancelSound = async () => {
    try {
      await audio.unloadAsync();
    } catch (error) {
      console.error("Lỗi khi dừng âm thanh:", error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        duration,
        playSound,
        pauseSound,
        continuePlaySound,
        cancelSound,
        test,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
