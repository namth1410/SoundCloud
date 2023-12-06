import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";
const initialState = {
  songsResult: [],
  authorsResult: [],
  playlistsResult: [],
  loading: false,
  error: "",
  success: false,
};

export const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(SearchByKeyWord.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(SearchByKeyWord.fulfilled, (state, action) => {
        state.songsResult = action.payload.songs;
        state.authorsResult = action.payload.authors;
        state.playlistsResult = action.payload.playlists;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(SearchByKeyWord.rejected, (state, action) => {
        state.loading = false;
        state.error = "Tìm kiếm lỗi";
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

export const SearchByKeyWord = createAsyncThunk(
  "song/SearchSongs",
  async (keyword) => {
    try {
      const config = {
        params: {
          searchTerm: keyword,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Songs/SearchSongs`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm: ", error);
      console.error("Lỗi khi tìm kiếm: ", error.response.data);
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

      const response = await axios.post(
        `${BASE_URL}/api/Songs/PostSongFromUser`,
        info,
        config
      );

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

export const {} = searchSlice.actions;

export default searchSlice.reducer;
