import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./configAPI";

const initialState = {
  username: "",
  token: "",
  loading: false,
  error: "",
  success: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.username = action.meta.arg.username;
        state.token = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = "Tài khoản hoặc mật khẩu sai";
        success = false;
      })
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.username = "";
        state.token = "";
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = "Kiểm tra lại thông tin";
      });
  },
});

export const signIn = createAsyncThunk("user/signIn", async (infoSignIn) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/Accounts/SignIn`,
      infoSignIn
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi rồi: ", error.response.data);
    throw error;
  }
});

export const signUp = createAsyncThunk("user/signUp", async (infoSignUp) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/Accounts/SignUp`,
      infoSignUp
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.errors);
  }
});

export const {} = userSlice.actions;

export default userSlice.reducer;
