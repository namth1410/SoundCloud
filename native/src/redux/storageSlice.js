import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storage: [],
  queue: [],
  loading: false,
  error: "",
  success: false,
};

export const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    deleteSongFromStorage: (state, action) => {
      const { id } = action.payload;
      const updatedStorage = [...state.storage];
      const itemIndex = updatedStorage.findIndex((item) => item.id === id);
      if (itemIndex >= 0) {
        updatedStorage.splice(itemIndex, 1);
      }
      return {
        ...state,
        storage: updatedStorage,
      };
    },

    addQueue: (state, action) => {
      return {
        ...state,
        queue: [action.payload, ...state.queue],
      };
    },

    addStorage: (state, action) => {
      return {
        ...state,
        storage: [action.payload, ...state.storage],
      };
    },

    updateStorage: (state, action) => {
      return {
        ...state,
        storage: action.payload,
      };
    },



    updateProgress: (state, action) => {
      const { idSong, progress } = action.payload;
      const itemToUpdate = state.queue.find((item) => item.id === idSong);
      if (itemToUpdate) {
        itemToUpdate.progress = progress;
      }
    },

    removeQueue: (state, action) => {
      const { id } = action.payload;
      const updatedQueue = [...state.queue];
      const itemIndex = updatedQueue.findIndex((item) => item.id === id);
      if (itemIndex >= 0) {
        updatedQueue.splice(itemIndex, 1);
      }
      return {
        ...state,
        queue: updatedQueue,
      };
    }
  },
});

export const {
  deleteSongFromStorage,
  addQueue,
  addStorage,
  updateStorage,
  updateProgress,
  removeQueue
} = storageSlice.actions;

export default storageSlice.reducer;
