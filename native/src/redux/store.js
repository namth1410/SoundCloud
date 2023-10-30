import { configureStore } from "@reduxjs/toolkit";
import authorReducer from "./authorSlice";
import configAudioSlice from "./configAudioSlice";
import historyReducer from "./historySlice";
import playSongReducer from "./playSongSlice";
import playlistDetailReducer from "./playlistDetailSlice";
import playlistSlice from "./playlistSlice";
import songLikeReducer from "./songLikeSlice";
import songReducer from "./songSlice";
import storageSlice from "./storageSlice";
import suggestSongReducer from "./suggestSongSlice";
import userReducer from "./userSlice";
import uploadReducer from "./uploadSlice";

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
  },
});
