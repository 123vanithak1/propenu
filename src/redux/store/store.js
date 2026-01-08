import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cityReducer from "../slice/CitySlice";
import postPropertyReducer from "../slice/PostPropertySlice";
import filerSliceReducer from "../slice/FilterSlice";

export const store = configureStore({
  reducer: {
     city: cityReducer,
     filter : filerSliceReducer,
    postProperty: postPropertyReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

