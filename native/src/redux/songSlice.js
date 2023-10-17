import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  songs: [],
  loading: false,
  error: "",
  success: false,
};

export const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {},
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
        state.error = "Lấy tất cả bài hát lỗi";
        success = false;
      })

      .addCase(postSongFromUserAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(postSongFromUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(postSongFromUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Tải bài hát lên MYSQL lỗi";
        success = false;
      });
  },
});

export const getAllSong = createAsyncThunk("song/getAllSong", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/Songs`);
    return response.data;
  } catch (error) {
    console.error("Lỗi rồi: ", error.response.data);
    throw error;
  }
});

export const postSongFromUserAsync = createAsyncThunk(
  "song/postSongFromUser",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.post(`${BASE_URL}/api/Songs`, info, config);

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải lên bài hát MySQL: ", error.response);
      throw error;
    }
  }
);

export const deleteSongFromUserAsync = createAsyncThunk(
  "song/deleteSongFromUserAsync",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idSong: info.idSong.toString(),
        },
      };

      const response = await axios.delete(`${BASE_URL}/api/Songs`, config);

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát: ", error);
      throw error;
    }
  }
);

export const {} = songSlice.actions;

export default songSlice.reducer;
