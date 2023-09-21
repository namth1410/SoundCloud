import { configureStore } from "@reduxjs/toolkit";
import playSongReducer from "./playSongSlice";
import songReducer from "./songSlice";
import userReducer from "./userSlice";
import modalSlice from "./modalSlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    allSong: songReducer,
    playSong: playSongReducer,
    modal: modalSlice,
  },
});
