import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";
const initialState = {
  audioCloud: [],
  loading: false,
  error: "",
  success: false,
};

export const audioCloudSlice = createSlice({
  name: "audioCloudSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(GetSongsOfUser.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(GetSongsOfUser.fulfilled, (state, action) => {
        state.audioCloud = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(GetSongsOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy danh sách bài hát đã tải lên lỗi";
        success = false;
      })

      .addCase(postSongFromUserAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(postSongFromUserAsync.fulfilled, (state, action) => {
        state.audioCloud = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(postSongFromUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Tải bài hát lên MYSQL lỗi";
        success = false;
      })

      .addCase(deleteSongFromUserAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteSongFromUserAsync.fulfilled, (state, action) => {
        state.audioCloud = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deleteSongFromUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Tải bài hát lên MYSQL lỗi";
        success = false;
      });
  },
});

export const GetSongsOfUser = createAsyncThunk(
  "song/GetSongsOfUser",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Songs/GetSongsOfUser`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài hát đã tải lên: ", error);
      console.error(
        "Lỗi khi tải danh sách bài hát đã tải lên: ",
        error.response.data
      );
      throw error;
    }
  }
);

export const postSongFromUserAsync = createAsyncThunk(
  "song/postSongFromUser",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.post(`${BASE_URL}/api/Songs/PostSongFromUser`, info, config);

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
          idSong: info.idSong,
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

export const {} = audioCloudSlice.actions;

export default audioCloudSlice.reducer;
