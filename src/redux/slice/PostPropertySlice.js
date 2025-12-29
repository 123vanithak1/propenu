import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 1,
  propertyType: null, // "residential" | "commercial" | "land" | "agricultural"
  base: {
    nearbyPlaces: [],
  },
  residential: {},
  commercial: {},
  land: {},
  agricultural: {},
};

const postPropertySlice = createSlice({
  name: "postProperty",
  initialState,
  reducers: {
    /* -------- Step control -------- */
    nextStep(state) {
      state.currentStep += 1;
    },

    prevStep(state) {
      state.currentStep -= 1;
    },

    /* -------- Property type -------- */
    setPropertyType(state, action) {
      state.propertyType = action.payload;
    },

    /* -------- Base fields -------- */
    setBaseField(state, action) {
      const { key, value } = action.payload;
      state.base[key] = value;
    },

    /* -------- Profile fields (dynamic) -------- */
    setProfileField(state, action) {
      const { propertyType, key, value } = action.payload;

      if (!propertyType) {
        console.warn(
          "setProfileField: propertyType is required but got:",
          propertyType
        );
        return;
      }

      state[propertyType][key] = value;
    },
  },
});

export const {
  setPropertyType,
  setBaseField,
  setProfileField,
  nextStep,
  prevStep,
} = postPropertySlice.actions;

export default postPropertySlice.reducer;
