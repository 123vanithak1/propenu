import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/apiService";
import { getItem } from "../../utils/Storage";
import {
  getFiles as getFileStoreFiles,
  clearFiles as clearFileStoreFiles,
} from "../../lib/FileStore";

export const submitPropertyThunk = createAsyncThunk(
  "postProperty/submit",
  async (argPropertyType, { getState, rejectWithValue }) => {
    try {
      const state = getState().postProperty;
      const { base } = state;

      const propertyType = argPropertyType || state.propertyType;
      if (!propertyType) {
        throw new Error("Property type not selected");
      }

       const userData = await getItem("user");
      if (!userData || !userData.user) {
        throw new Error("User not authenticated");
      }

      const user = userData.user;

      // 🔹 Select profile by property type
      const profile =
        propertyType === "residential"
          ? state.residential
          : propertyType === "commercial"
          ? state.commercial
          : propertyType === "land"
          ? state.land
          : state.agricultural;

      const apiPropertyType =
        propertyType === "residential"
          ? state.residential.propertyType ||
            state.residential.propertySubType
          : propertyType === "commercial"
          ? state.commercial.propertyType ||
            state.commercial.propertySubType
          : propertyType === "land"
          ? state.land.propertyType || state.land.propertySubType
          : state.agricultural.propertyType ||
            state.agricultural.propertySubType;

      if (!apiPropertyType) {
        throw new Error(`Property sub-type is required for ${propertyType}`);
      }

      const userId = user.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // 🔹 Base payload (NO files here)
      const payload = {
        ...base,
        ...profile,
        propertyType: apiPropertyType,
        createdBy: userId,
        listingSource: user.roleName || "user",
      };

      // 🔹 Handle gallery metadata (ONLY URLs)
      const galleryMeta = Array.isArray(payload.galleryFiles)
        ? payload.galleryFiles
        : [];

      if (galleryMeta.length > 0) {
        const urlGallery = galleryMeta
          .filter((g) => typeof g?.url === "string")
          .map((g) => ({ url: g.url }));

        if (urlGallery.length > 0) {
          payload.gallery = urlGallery;
        }

        delete payload.galleryFiles;
      }

      // 🔹 Build FormData
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // 🔹 Attach local images (uri-based)
      const actualFiles = getFileStoreFiles("postProperty");

      if (Array.isArray(actualFiles) && actualFiles.length > 0) {
        actualFiles.forEach((file) => {
          formData.append("galleryFiles", {
            uri: file.uri,
            name: file.fileName || file.name || "image.jpg",
            type: file.mimeType || file.type || "image/jpeg",
          });
        });

        clearFileStoreFiles("postProperty");
      }
      console.log("formData" , formData)

      // 🔹 Submit based on property type
      switch (propertyType) {
        case "residential":
          return await apiService.residentialApi(formData);
        case "commercial":
          return await apiService.commercialApi(formData);
        case "land":
          return await apiService.landApi(formData);
        case "agricultural":
          return await apiService.agriculturalApi(formData);
        default:
          throw new Error("Invalid property type");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
