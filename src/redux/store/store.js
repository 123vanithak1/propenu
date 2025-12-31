// import { configureStore } from "@reduxjs/toolkit";
// import postPropertyReducer from "../slice/PostPropertySlice";

// export const store = configureStore({
//   reducer: {
//     postProperty: postPropertyReducer,
//   },
// });



import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import postPropertyReducer from "../slice/PostPropertySlice";

export const store = configureStore({
  reducer: {
    postProperty: postPropertyReducer,
  },
  // devTools enabled by default in development
});

// Typed hooks are not needed in JS, but you can create helpers:
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

