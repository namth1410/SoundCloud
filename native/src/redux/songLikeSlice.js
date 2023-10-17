import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  songLikeList: [],
  loading: false,
  error: "",
  success: false,
};

export const songLikeSlice = createSlice({
  name: "songLike",
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

      .addCase(getSongLikeList.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getSongLikeList.fulfilled, (state, action) => {
        state.songLikeList = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getSongLikeList.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy danh sách bài hát yêu thích lỗi";
        success = false;
      })

      .addCase(addSongLikeAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addSongLikeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(addSongLikeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Thêm bài hát vào danh sách yêu thích lỗi";
        success = false;
      })

      .addCase(deleteSongLikeAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteSongLikeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deleteSongLikeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Xóa bài hát vào danh sách yêu thích lỗi";
        success = false;
      });
  },
});

export const getSongLikeList = createAsyncThunk(
  "song/getSongLikeList",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Songs/getSongLike`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài hát yêu thích: ", error);
      console.error(
        "Lỗi khi tải danh sách bài hát yêu thích: ",
        error.response.data
      );
      throw error;
    }
  }
);

export const addSongLikeAsync = createAsyncThunk(
  "song/addSongLike",
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

      const response = await axios.post(
        `${BASE_URL}/api/Songs/addSongLike`,
        {},
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm bài hát yêu thích: ", error.response.data);
      throw error;
    }
  }
);

export const deleteSongLikeAsync = createAsyncThunk(
  "song/deleteSongLike",
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

      const response = await axios.delete(
        `${BASE_URL}/api/Songs/deleteSongLike`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa bài hát yêu thích: ", error);
      throw error;
    }
  }
);

export const { addSongLike, deleteSongLike } = songLikeSlice.actions;

export default songLikeSlice.reducer;
