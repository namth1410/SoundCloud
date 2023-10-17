import { createSlice } from "@reduxjs/toolkit";

export const PLAY_MODE = {
  LOOP: "LOOP",
  SEQUENCE: "SEQUENCE",
  RANDOM: "RANDOM",
};

const initialState = {
  playMode: PLAY_MODE.SEQUENCE,
};

export const configAudioSlice = createSlice({
  name: "configAudio",
  initialState,
  reducers: {
    setPlayMode: (state, action) => {
      return {
        ...state,
        playMode: action.payload,
      };
    },
  },
});
``;
export const { setPlayMode } = configAudioSlice.actions;

export default configAudioSlice.reducer;
