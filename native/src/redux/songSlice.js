import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Song from "../model/Song";
import axios from "axios";
const baseUrl =
  "https://a6d6-2402-800-62d0-3c4c-e97a-471f-1ad4-78ab.ngrok-free.app";

const initialState = {
  songs: [],
  timeRelease: "",
  loading: false,
  error: "",
  success: false,
};

export const userSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    updateTop100: (state, action) => {
      return {};
      // state.push(action.payload);
    },
    signIn: (state, action) => {
      return {
        username: action.payload.username,
        token: action.payload.token,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSong.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllSong.fulfilled, (state, action) => {
        state.songs = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getAllSong.rejected, (state, action) => {
        state.loading = false;
        state.error = "API lỗi";
        success = false;
      });
  },
});

export const getAllSong = createAsyncThunk("song/getAllSong", async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Songs`);
    return response.data;
  } catch (error) {
    console.error("Lỗi rồi: ", error);
    throw error;
  }
});

export const signUp = createAsyncThunk("user/signUp", async (infoSignUp) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/Accounts/SignUp`,
      infoSignUp
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.errors);
  }
});

export const { updateTop100, signIn } = userSlice.actions;

export default userSlice.reducer;
