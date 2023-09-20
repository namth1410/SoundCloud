import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  display: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state, action) => {
      return {
        display: true,
      };
    },

    hideModal: (state, action) => {
      return {
        display: false,
      };
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
