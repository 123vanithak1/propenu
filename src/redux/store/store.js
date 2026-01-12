import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cityReducer from "../slice/CitySlice";
import postPropertyReducer from "../slice/PostPropertySlice";
import filterSlice from "../slice/FilterSlice";

export const store = configureStore({
  reducer: {
    city: cityReducer,
    filters: filterSlice,
    postProperty: postPropertyReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
