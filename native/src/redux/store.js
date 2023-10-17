import { configureStore } from "@reduxjs/toolkit";
import configAudioSlice from "./configAudioSlice";
import historyReducer from "./historySlice";
import playSongReducer from "./playSongSlice";
import playlistSlice from "./playlistSlice";
import songLikeReducer from "./songLikeSlice";
import songReducer from "./songSlice";
import storageSlice from "./storageSlice";
import suggestSongReducer from "./suggestSongSlice";
import userReducer from "./userSlice";
import playlistDetailReducer from "./playlistDetailSlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    allSong: songReducer,
    songLikeRedux: songLikeReducer,
    historyRedux: historyReducer,
    suggestSongRedux: suggestSongReducer,
    playSongRedux: playSongReducer,
    configAudio: configAudioSlice,
    storageRedux: storageSlice,
    playlistRedux: playlistSlice,
    playlistDetailRedux: playlistDetailReducer,
  },
});
