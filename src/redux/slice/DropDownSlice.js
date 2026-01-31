import { createSlice } from "@reduxjs/toolkit";

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState: {
    isOpen: false,
    selectedCity: null,
  },
  reducers: {
    toggleDropdown: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeDropdown: (state) => {
      state.isOpen = false;
    },
    setCity: (state, action) => {
      state.selectedCity = action.payload;
      state.isOpen = false;
    },
  },
});

export const { toggleDropdown, closeDropdown, setCity } =
  dropdownSlice.actions;
export default dropdownSlice.reducer;
