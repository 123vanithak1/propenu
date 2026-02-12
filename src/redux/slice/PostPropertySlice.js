import { createSlice } from "@reduxjs/toolkit";
import { createDraftThunk, getMyDraftThunk } from "../thunk/SubmitPropertyThunk";

/* ======================================================
   DRAFT → CATEGORY DETECTOR
====================================================== */

const detectCategoryFromDraft = (draft, fallback) => {
  if (typeof draft.slug === "string") {
    if (draft.slug.startsWith("residential")) return "residential";
    if (draft.slug.startsWith("commercial")) return "commercial";
    if (draft.slug.startsWith("land")) return "land";
    if (draft.slug.startsWith("agricultural")) return "agricultural";
  }

  if (["apartment", "villa", "independent-house"].includes(draft.propertyType))
    return "residential";

  if (["office", "shop", "warehouse"].includes(draft.propertyType))
    return "commercial";

  if (["plot", "land"].includes(draft.propertyType)) return "land";

  return fallback;
};

/* ======================================================
   INITIAL STATE
====================================================== */

const initialState = {
  currentStep: 1,
  progressPercent: 0,
  propertyType: "residential",
  draftId: null,
  base: {
    nearbyPlaces: [],
  },
  residential: {},
  commercial: {},
  land: {},
  agricultural: {},
};

/* ======================================================
   SLICE
====================================================== */

const postPropertySlice = createSlice({
  name: "postProperty",
  initialState,

  reducers: {
    /* -------- Step control -------- */
    setDraftId(state, action) {
      state.draftId = action.payload;
    },

    nextStep(state) {
      state.currentStep += 1;
    },

    prevStep(state) {
      state.currentStep -= 1;
    },

    setStep(state, action) {
      state.currentStep = action.payload;
    },
     setPercentage(state, action) {
      state.percentage = action.payload;
    },

    /* -------- Property category -------- */
    setPropertyType(state, action) {
      const next = action.payload;

      state.propertyType = next;

      if (next !== "residential") state.residential = {};
      if (next !== "commercial") state.commercial = {};
      if (next !== "land") state.land = {};
      if (next !== "agricultural") state.agricultural = {};
    },

    /* -------- Base fields -------- */
    setBaseField(state, action) {
      const { key, value } = action.payload;
      state.base[key] = value;
    },

    /* -------- Category fields -------- */
    setProfileField(state, action) {
      const { propertyType, key, value } = action.payload;
      state[propertyType][key] = value;
    },
    
    resetPostProperty: () => initialState,
  },

  extraReducers: (builder) => {
    /* =========================
       GET MY DRAFT
    ========================= */
    builder.addCase(getMyDraftThunk.fulfilled, (state, action) => {
      const draft = action.payload?.data;
      if (!draft) return;

      state.draftId = draft._id;
      state.currentStep = draft.completion?.step ?? 1;
      state.progressPercent = draft.completion?.percent ?? 0;

      const category = detectCategoryFromDraft(draft, state.propertyType);
      state.propertyType = category;

      state.base = {
        ...state.base,
        listingType: draft.listingType,
        city: draft.city,
        buildingName: draft.buildingName,
        locality: draft.locality,
        location: draft.location,
        address: draft.address,
        pincode: draft.pincode,
        state: draft.state,
      };

      const mapGallery = () =>
        Array.isArray(draft.gallery)
          ? draft.gallery.map((img) => ({
              url: img.url,
              key: img.key,
              filename: img.filename,
              order: img.order ?? 0,
              source: "server",
            }))
          : [];

      if (category === "residential") {
        state.residential = {
          ...state.residential,
          builtUpArea: draft.builtUpArea,
          carpetArea: draft.carpetArea,
          facing:
            typeof draft.facing === "string"
              ? draft.facing.toLowerCase()
              : draft.facing,
          parkingDetails: {
            twoWheeler: draft.parkingDetails?.twoWheeler ?? 0,
            fourWheeler: draft.parkingDetails?.fourWheeler ?? 0,
          },
          parkingType: draft.parkingType,
          amenities: draft.amenities ?? [],
          bedrooms: draft.bedrooms,
          floorNumber: draft.floorNumber,
          flooringType: draft.flooringType,
          totalFloors: draft.totalFloors,
          kitchenType: draft.kitchenType,
          isModularKitchen: draft.isModularKitchen,
          isPriceNegotiable: draft.isPriceNegotiable,
          bathrooms: draft.bathrooms,
          balconies: draft.balconies,
          furnishing: draft.furnishing,
          propertyType: draft.propertyType,
          constructionStatus: draft.constructionStatus,
          propertyAge: draft.propertyAge,
          transactionType: draft.transactionType,
          price: draft.price,
          pricePerSqft: draft.pricePerSqft,
          description: draft.description,
          gallery: mapGallery(),
        };
      }

      if (category === "commercial") {
        state.commercial = {
          propertyType: draft.propertyType,
          furnishing: draft.furnishedStatus,
          price: draft.price,
          commercialSubType: draft.propertySubType,
          transactionType: draft.transactionType,
          constructionStatus: draft.constructionStatus,
          carpetArea: draft.carpetArea,
          builtUpArea: draft.builtUpArea,
          floorNumber: draft.floorNumber,
          totalFloors: draft.totalFloors,
          pantry: draft.pantry,
          powerCapacity: draft.powerCapacity,
          parkingDetails: {
            twoWheeler: draft.parkingDetails?.twoWheeler ?? 0,
            fourWheeler: draft.parkingDetails?.fourWheeler ?? 0,
          },
          fireSafety: draft.fireSafety,
          flooringType: draft.flooringType,
          wallFinishStatus: draft.wallFinishStatus,
          tenantAvailable: draft.tenantAvailable,
          banksApproved: draft.banksApproved,
          isPriceNegotiable: draft.isPriceNegotiable,
          verifiedProperties: draft.verifiedProperties,
          description: draft.description,
          gallery: mapGallery(),
        };
      }

      if (category === "land") {
        state.land = {
          propertyType: draft.propertyType,
          landSubType: draft.propertySubType,
          price: draft.price,
          dimensions: draft.dimensions,
          plotArea: draft.plotArea,
          plotAreaUnit: draft.plotAreaUnit,
          roadWidthFt: draft.roadWidthFt,
          facing: draft.facing,
          cornerPlot: draft.cornerPlot,
          readyToConstruct: draft.readyToConstruct,
          waterConnection: draft.waterConnection,
          electricityConnection: draft.electricityConnection,
          approvedBy: draft.approvedBy,
          landUseZone: draft.landUseZone,
          banksApproved: draft.banksApproved,
          isPriceNegotiable: draft.isPriceNegotiable,
          description: draft.description,
          verifiedProperties: draft.verifiedProperties,
          gallery: mapGallery(),
        };
      }

      if (category === "agricultural") {
        state.agricultural = {
          propertyType: draft.propertyType,
          agriculturalSubType: draft.propertySubType,
          boundaryWall: draft.boundaryWall,
          soilType: draft.soilType,
          irrigationType: draft.irrigationType,
          currentCrop: draft.currentCrop,
          landName: draft.landName,
          landShape: draft.landShape,
          numberOfBorewells: draft.numberOfBorewells,
          borewellDetails: draft.borewellDetails,
          waterSource: draft.waterSource,
          accessRoadType: draft.accessRoadType,
          statePurchaseRestrictions: draft.statePurchaseRestrictions,
          electricityConnection: draft.electricityConnection,
          totalArea: draft.totalArea,
          roadWidth: draft.roadWidth,
          price: draft.price,
          isPriceNegotiable: draft.isPriceNegotiable,
          description: draft.description,
          gallery: mapGallery(),
        };
      }
    });

    /* =========================
       CREATE DRAFT
    ========================= */
    builder.addCase(createDraftThunk.fulfilled, (state, action) => {
      const draft = action.payload?.data;
      if (!draft) return;

      state.draftId = draft._id;
      state.propertyType = detectCategoryFromDraft(draft, state.propertyType);
      state.currentStep = 1;
    });
  },
});

/* ======================================================
   EXPORTS
====================================================== */

export const {
  setPropertyType,
  setBaseField,
  setProfileField,
  nextStep,
  prevStep,
  setStep,
  setPercentage,
  setDraftId,
  resetPostProperty ,
} = postPropertySlice.actions;

export default postPropertySlice.reducer;
