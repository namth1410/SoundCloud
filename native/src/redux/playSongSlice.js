import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  nameSong: "",
  nameAuthor: "",
  linkSong: "",
  playing: false,
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
        id: action.payload.id,
        nameSong: action.payload.nameSong,
        nameAuthor: action.payload.nameAuthor,
        linkSong: action.payload.linkSong,
        playing: true,
      };
    },

    pauseSong: (state, action) => {
      return {
        ...state,
        playing: false,
      };
    },
    continuePlaySong: (state, action) => {
      return {
        ...state,
        playing: true,
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
