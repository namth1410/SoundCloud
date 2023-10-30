import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  songList: [],
  playlistList: [],
  nameAuthor: "",
  emailAuthor: "",
  loading: false,
  error: "",
  success: false,
};

export const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getInfoAuthor.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getInfoAuthor.fulfilled, (state, action) => {
        state.songList = [...action.payload.songs];
        state.playlistList = [...action.payload.playlists];
        state.nameAuthor = action.payload.user.name;
        state.emailAuthor = action.payload.user.email;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getInfoAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy danh sách lịch sử lỗi";
        success = false;
      });
  },
});

export const getInfoAuthor = createAsyncThunk(
  "author/getInfoAuthor",
  async (info) => {
    try {
      const config = {
        params: {
          idUser: info.idUser,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Songs/getInfoByAuthor`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tác giả: ", error);
      console.error("Lỗi khi lấy thông tin tác giả: ", error.response.data);
      throw error;
    }
  }
);

export const {} = authorSlice.actions;

export default authorSlice.reducer;
