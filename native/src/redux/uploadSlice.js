import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadFiles: [],
  loading: false,
  error: "",
  success: false,
  uploading: false,
};

export const uploadSlice = createSlice({
  name: "uploadSlice",
  initialState,
  reducers: {
    addFile: (state, action) => {
      return {
        ...state,
        uploadFiles: [...state.uploadFiles, action.payload],
      };
    },

    deleteFile: (state, action) => {
      const _uploadFiles = state.uploadFiles.filter(
        (file) => file.assets[0].uri !== action.payload.assets[0].uri
      );

      return {
        ...state,
        uploadFiles: _uploadFiles,
      };
    },

    updateFile: (state, action) => {
      const updatedFile = action.payload;
      const fileIndex = state.uploadFiles.findIndex(
        (file) => file.assets[0].uri === updatedFile.assets[0].uri
      );

      if (fileIndex !== -1) {
        state.uploadFiles[fileIndex] = updatedFile;
      }
    },

    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
  },
});

export const { addFile, deleteFile, updateFile, setUploading } =
  uploadSlice.actions;

export default uploadSlice.reducer;
