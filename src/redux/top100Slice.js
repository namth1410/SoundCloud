import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateTop100: (state, action) => {
      state = action.payload;
    },
  },
});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;
