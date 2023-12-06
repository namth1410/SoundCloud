import { configureStore } from "@reduxjs/toolkit";
import audioCloudReducer from "./audioCloudSlice";
import authorReducer from "./authorSlice";
import configAudioSlice from "./configAudioSlice";
import historyReducer from "./historySlice";
import playSongReducer from "./playSongSlice";
import playlistDetailReducer from "./playlistDetailSlice";
import playlistSlice from "./playlistSlice";
import searchReducer from "./searchSlice";
import songLikeReducer from "./songLikeSlice";
import songReducer from "./songSlice";
import storageSlice from "./storageSlice";
import suggestSongReducer from "./suggestSongSlice";
import uploadReducer from "./uploadSlice";
import userReducer from "./userSlice";
import userConnectReducer from "./userConnectSlice";
import dataRoomReducer from "./dataRoomSlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    authorInfoRedux: authorReducer,
    allSong: songReducer,
    songLikeRedux: songLikeReducer,
    historyRedux: historyReducer,
    suggestSongRedux: suggestSongReducer,
    playSongRedux: playSongReducer,
    configAudio: configAudioSlice,
    storageRedux: storageSlice,
    playlistRedux: playlistSlice,
    playlistDetailRedux: playlistDetailReducer,
    uploadRedux: uploadReducer,
    audioCloudRedux: audioCloudReducer,
    searchRedux: searchReducer,
    userConnectRedux: userConnectReducer,
    dataRoomRedux: dataRoomReducer,
  },
});
