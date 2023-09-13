import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
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
        nameSong: action.payload.nameSong,
        nameAuthor: action.payload.nameAuthor,
        linkSong: action.payload.linkSong,
        playing: true,
      };
    },
    pauseSong: (state, action) => {
      return {
        playing: false,
      };
    },
    cancelSong: (state, action) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { playSong, pauseSong, cancelSong } = playSongSlice.actions;

export default playSongSlice.reducer;
