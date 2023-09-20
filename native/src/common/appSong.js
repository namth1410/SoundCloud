import { Audio } from "expo-av";

const appSong = new Audio.Sound();

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
    let checkLoading = await appSong.getStatusAsync();
    if (checkLoading.isLoaded) {
      await appSong.unloadAsync();
    }
    await appSong.loadAsync(source);
    await appSong.playAsync();
  } catch (error) {
    console.error("Lỗi khi tải âm thanh:", error);
  }
};

const pauseSound = async () => {
  try {
    const checkLoading = await appSong.getStatusAsync();
    if (checkLoading.isLoaded && checkLoading.isPlaying) {
      await appSong.pauseAsync();
    }
  } catch (error) {
    console.error("Lỗi khi tạm dừng âm thanh:", error);
  }
};

const continuePlaySound = async () => {
  try {
    await Audio.setIsEnabledAsync(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    let checkLoading = await appSong.getStatusAsync();
    if (!checkLoading.isLoaded) {
      await appSong.loadAsync(source);
    }
    checkLoading = await appSong.getStatusAsync();
    if (checkLoading.isLoaded && !checkLoading.isPlaying) {
      await appSong.playAsync();
    }
  } catch (error) {
    console.error("Lỗi khi phát tiếp âm thanh:", error);
  }
};

const cancelSound = async () => {
  try {
    await appSong.unloadAsync();
  } catch (error) {
    console.error("Lỗi khi dừng âm thanh:", error);
  }
};

export { cancelSound, continuePlaySound, pauseSound, playSound };

export default appSong;
