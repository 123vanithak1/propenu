import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit";
import { apiService } from "../../services/apiService";
/**
 * 🔹 Use a config file or constants file in React Native
 * Example: src/config/api.js
 */

/* ---------------- ASYNC THUNK ---------------- */
export const fetchLocations = createAsyncThunk(
  "city/fetchLocations",
  async () => {
    const response = await apiService.location()
    const data = await response.json();
    return data.locations || [];
  }
);

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
  locations: [],
  selectedCityId: null,
};

/* ---------------- SLICE ---------------- */
const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCityId(state, action) {
      state.selectedCityId = action.payload;
    },
    clearCity(state) {
      state.selectedCityId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.locations = action.payload;
    });
  },
});

/* ---------------- SELECTORS ---------------- */

// Selected city object
export const selectSelectedCity = (state) => {
  const { locations, selectedCityId } = state.city;
  return locations.find((c) => c._id === selectedCityId) || null;
};

const EMPTY_ARRAY = [];

// Localities for selected city
export const selectLocalitiesByCity = (state) =>
  selectSelectedCity(state)?.localities ?? EMPTY_ARRAY;

// Combined helper
export const selectCityWithLocalities = createSelector(
  [selectSelectedCity],
  (city) => {
    if (!city) return null;

    return {
      city: city.city,
      state: city.state,
      localities: city.localities,
    };
  }
);

/* ---------------- EXPORTS ---------------- */
export const { setCityId, clearCity } = citySlice.actions;
export default citySlice.reducer;
