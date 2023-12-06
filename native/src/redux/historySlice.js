import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  historyList: [],
  loading: false,
  error: "",
  success: false,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getHistoryList.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getHistoryList.fulfilled, (state, action) => {
        state.historyList = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(getHistoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = "Lấy danh sách lịch sử lỗi";
        success = false;
      })

      .addCase(addHistoryAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addHistoryAsync.fulfilled, (state, action) => {
        state.historyList = [...action.payload];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(addHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Thêm bài hát vào lịch sử lỗi";
        success = false;
      })

      .addCase(deleteHistoryAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteHistoryAsync.fulfilled, (state, action) => {
        state.historyList = [...action.payload];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deleteHistoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Xóa bài hát lịch sử lỗi";
        success = false;
      })

      .addCase(deleteHistoryAllAsync.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteHistoryAllAsync.fulfilled, (state, action) => {
        state.historyList = [];
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(deleteHistoryAllAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Xóa tất cả lịch sử lỗi";
        success = false;
      });
  },
});

export const getHistoryList = createAsyncThunk(
  "song/getHistoryList",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/Songs/getHistory`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải lịch sử nghe: ", error);
      console.error("Lỗi khi tải lịch sử nghe: ", error.response.data);
      throw error;
    }
  }
);

export const addHistoryAsync = createAsyncThunk(
  "song/addHistory",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
        params: {
          idSong: info.id,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/api/Songs/addHistory`,
        {},
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm bài hát vào lịch sử: ", error.response.data);
      throw error;
    }
  }
);

export const deleteHistoryAsync = createAsyncThunk(
  "song/deleteHistory",
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
        `${BASE_URL}/api/Songs/deleteHistory`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử: ", error);
      throw error;
    }
  }
);

export const deleteHistoryAllAsync = createAsyncThunk(
  "song/deleteHistoryAll",
  async (info) => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + info.token,
        },
      };

      const response = await axios.delete(
        `${BASE_URL}/api/Songs/deleteHistoryAll`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa tất cả lịch sử: ", error);
      throw error;
    }
  }
);

export const {} = historySlice.actions;

export default historySlice.reducer;
