import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import songReducer from "./songSlice";
import playSongReducer from "./playSongSlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    allSong: songReducer,
    playSong: playSongReducer,
  },
});
