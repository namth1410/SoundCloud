import { configureStore } from "@reduxjs/toolkit";
import top100Reducer from "./top100Slice";

export const store = configureStore({
  reducer: {
    top100: top100Reducer,
  },
});
