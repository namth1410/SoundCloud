import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  playlistList: [],
  loading: false,
  error: "",
  success: false,
};

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    addSongLike: (state, action) => {
      return {
        ...state,
        songLikeList: [...state.songLikeList, action.payload],
      };
    },

    deleteSongLike: (state, action) => {
      return {
        ...state,
        songLikeList: state.songLikeList.filter(
          (item) => item.id !== action.payload.id
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getPlaylists.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getPlaylists.fulfilled, (state, action) => {
        state.playlistList = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy danh sách các playlist lỗi";
        success = false;
      })

      .addCase(addPlaylistAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addPlaylistAsync.fulfilled, (state, action) => {
        state.playlistList = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(addPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        success = false;
      })

      .addCase(deletePlaylistAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deletePlaylistAsync.fulfilled, (state, action) => {
        state.playlistList = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deletePlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Xóa playlist lỗi";
        success = false;
      });
  },
});

export const getPlaylists = createAsyncThunk(
  "song/getPlaylists",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Playlist/getPlaylists`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách các playlist: ", error);
      console.error(
        "Lỗi khi lấy danh sách các playlist: ",
        error.response.data
      );
      throw error;
    }
  }
);

export const addPlaylistAsync = createAsyncThunk(
  "song/addPlaylist",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/api/Playlist/postPlaylist`,
        info,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm playlist mới: ", error.response.data);
      const errorMessage = error.response
        ? error.response.data
        : "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }
);

export const deletePlaylistAsync = createAsyncThunk(
  "song/deletePlaylist",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idPlaylist: info.idPlaylist,
        },
      };

      const response = await axios.delete(
        `${BASE_URL}/api/Playlist/deletePlaylist`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát yêu thích: ", error);
      throw error;
    }
  }
);

export const { addSongLike, deleteSongLike } = playlistSlice.actions;

export default playlistSlice.reducer;
