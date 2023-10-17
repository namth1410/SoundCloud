import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storage: [],
  loading: false,
  isChanged: false,
  error: "",
  success: false,
};

export const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    Updated: (state, action) => {
      return {
        ...state,
        isChanged: false,
      };
    },

    deleteSongFromStorage: (state, action) => {
      return {
        ...state,
        isChanged: true,
      };
    },
  },
});

export const { Updated, deleteSongFromStorage } = storageSlice.actions;

export default storageSlice.reducer;
