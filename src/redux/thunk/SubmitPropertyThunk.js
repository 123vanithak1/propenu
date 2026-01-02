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

      // 🔹 Get logged-in user
      const userData = await getItem("user");
      if (!userData || !userData.user) {
        throw new Error("User not authenticated");
      }

      const user = userData.user;

      // 🔹 Select property profile based on type
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
          ? state.residential.propertyType || state.residential.propertySubType
          : propertyType === "commercial"
          ? state.commercial.propertyType || state.commercial.propertySubType
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

      // 🔹 Build payload
      let payload = {
        ...base,
        ...profile,
        propertyType: apiPropertyType,
        createdBy: userId,
        listingSource: user.roleName || "user",
      };

      // 🔹 Handle gallery metadata & files
      const galleryMeta = payload.galleryFiles || [];
      const actualFiles = getFileStoreFiles("postProperty");
      // if (Array.isArray(galleryMeta) && galleryMeta.length > 0) {
      //   const existingGallery = Array.isArray(payload.gallery)
      //     ? payload.gallery
      //     : [];

      //   const urlEntries = galleryMeta.filter(
      //     (g) => g && (g.url || (g.filename && g.url))
      //   );

      //   if (Array.isArray(actualFiles) && actualFiles.length > 0) {
      //     if (urlEntries.length > 0) {
      //       payload.gallery = [...existingGallery, ...urlEntries];
      //     }
      //   } else {
      //     payload.gallery = [...existingGallery, ...galleryMeta];
      //   }

      //   delete payload.galleryFiles;
      //   delete payload.files;
      // }

      if (Array.isArray(galleryMeta) && galleryMeta.length > 0) {
        const existingGallery = Array.isArray(payload.gallery)
          ? payload.gallery
          : [];

        // ONLY allow valid url-based gallery items
        const urlEntries = galleryMeta
          .filter((g) => typeof g?.url === "string" && g.url.trim().length > 0)
          .map((g) => ({ url: g.url }));

        // If files are still local (ImagePicker), DO NOT push them to gallery
        if (Array.isArray(actualFiles) && actualFiles.length > 0) {
          payload.gallery = [...existingGallery, ...urlEntries];
        } else {
          payload.gallery = [...existingGallery, ...urlEntries];
        }

        delete payload.galleryFiles;
        delete payload.files;
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

      // 🔹 Attach actual image files
      if (Array.isArray(actualFiles) && actualFiles.length > 0) {
        actualFiles.forEach((file) => {
          formData.append("galleryFiles", file);
        });
        clearFileStoreFiles("postProperty");
      }

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
