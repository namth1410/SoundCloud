import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  idUser: "",
  idPlaylist: "",
  namePlaylist: "",
  access: "",
  playlistSongList: [],
  loading: false,
  error: "",
  success: false,
};

export const playlistDetailSlice = createSlice({
  name: "playlistDetail",
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

      .addCase(getSongsFromPlaylist.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getSongsFromPlaylist.fulfilled, (state, action) => {
        state.idPlaylist = action.payload.id;
        state.idUser = action.payload.idUser;
        state.namePlaylist = action.payload.namePlaylist;
        state.access = action.payload.access;
        state.playlistSongList = [...action.payload.songs];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getSongsFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy thông tin playlist lỗi";
        success = false;
      })

      .addCase(putPlaylistAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(putPlaylistAsync.fulfilled, (state, action) => {
        state.idPlaylist = action.payload.id;
        state.idUser = action.payload.idUser;
        state.namePlaylist = action.payload.namePlaylist;
        state.access = action.payload.access;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(putPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        success = false;
      })

      .addCase(postSongPlaylistAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(postSongPlaylistAsync.fulfilled, (state, action) => {
        state.playlistSongList = [...action.payload];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(postSongPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        success = false;
      })

      .addCase(deleteSongPlaylistAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteSongPlaylistAsync.fulfilled, (state, action) => {
        state.playlistSongList = [...action.payload];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deleteSongPlaylistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        success = false;
      });
  },
});

export const getSongsFromPlaylist = createAsyncThunk(
  "song/getSongsFromPlaylist",
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

      const response = await axios.get(
        `${BASE_URL}/api/Playlist/getSongsFromPlaylist`,
        config
      );

      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách các bài hát trong playlist: ",
        error
      );
      console.error(
        "Lỗi khi lấy danh sách các bài hát trong playlist: ",
        error.response.data
      );
      throw error;
    }
  }
);

export const putPlaylistAsync = createAsyncThunk(
  "song/putPlaylist",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idPlaylist: info.idPlaylist,
          access: info.access,
          namePlaylist: info.namePlaylist,
        },
      };

      const response = await axios.put(
        `${BASE_URL}/api/Playlist/putPlaylist`,
        info,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật playlist: ", error.response.data);
      const errorMessage = error.response
        ? error.response.data
        : "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }
);

export const postSongPlaylistAsync = createAsyncThunk(
  "song/postSongPlaylist",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idPlaylist: info.idPlaylist,
          idSong: info.idSong,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/api/Playlist/postSongPlaylist`,
        {},
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào playlist: ", error);
      const errorMessage = error.response
        ? error.response.data
        : "Lỗi không xác định";
      throw new Error(errorMessage);
    }
  }
);

export const deleteSongPlaylistAsync = createAsyncThunk(
  "song/deleteSongPlaylist",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idPlaylist: info.idPlaylist,
          idSong: info.idSong,
        },
      };

      const response = await axios.delete(
        `${BASE_URL}/api/Playlist/deleteSongPlaylist`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát trong playlist: ", error);
      throw error;
    }
  }
);

export const { addSongLike, deleteSongLike } = playlistDetailSlice.actions;

export default playlistDetailSlice.reducer;
