import { configureStore } from "@reduxjs/toolkit";
import postPropertyReducer from "../slice/PostPropertySlice";

export const store = configureStore({
  reducer: {
    postProperty: postPropertyReducer,
  },
});
