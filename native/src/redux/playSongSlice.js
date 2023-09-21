import { createSlice } from "@reduxjs/toolkit";
import { TYPE_ACTION } from "../common/typeAction";

const initialState = {
  nameSong: "",
  nameAuthor: "",
  linkSong: "",
  playing: false,
  typeAction: "",
  loading: false,
  error: "",
  success: false,
};

export const playSongSlice = createSlice({
  name: "playSong",
  initialState,
  reducers: {
    playSong: (state, action) => {
      return {
        ...state,
        nameSong: action.payload.nameSong,
        nameAuthor: action.payload.nameAuthor,
        linkSong: action.payload.linkSong,
        playing: true,
        typeAction: action.payload.typeAction,
      };
    },

    pauseSong: (state, action) => {
      return {
        ...state,
        playing: false,
        typeAction: TYPE_ACTION.PAUSE,
      };
    },
    continuePlaySong: (state, action) => {
      return {
        ...state,
        playing: true,
        typeAction: TYPE_ACTION.CONTINUE,
      };
    },
    cancelSong: (state, action) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { playSong, pauseSong, continuePlaySong, cancelSong } =
  playSongSlice.actions;

export default playSongSlice.reducer;
