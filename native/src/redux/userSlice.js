import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl =
  "https://a6d6-2402-800-62d0-3c4c-e97a-471f-1ad4-78ab.ngrok-free.app";

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
      .addCase(_signIn.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(_signIn.fulfilled, (state, action) => {
        state.username = action.meta.arg.username;
        state.token = action.payload;
        state.loading = false;
        state.error = "";
        success = true;
      })
      .addCase(_signIn.rejected, (state, action) => {
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

export const _signIn = createAsyncThunk("user/_signIn", async (infoSignIn) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/Accounts/SignIn`,
      infoSignIn
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi rồi: ", error);
    throw error;
  }
});

export const signUp = createAsyncThunk("user/signUp", async (infoSignUp) => {
  try {
    console.log(infoSignUp);
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
