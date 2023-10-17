import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  suggestSongList: [],
  loading: false,
  error: "",
  success: false,
};

export const suggestSongSlice = createSlice({
  name: "suggestSong",
  initialState,
  reducers: {
    getSuggestSongList: (state, action) => {
      return {
        ...state,
        suggestSongList: [action.payload],
      };
    },

    fakeDataSuggestSongList: (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        suggestSongList: [...action.payload],
      };
    },

    updateDataSuggestSongList: (state, action) => {
      return {
        ...state,
        suggestSongList: [...action.payload],
      };
    },
  },
});

export const {
  getSuggestSongList,
  fakeDataSuggestSongList,
  updateDataSuggestSongList,
} = suggestSongSlice.actions;

export default suggestSongSlice.reducer;
