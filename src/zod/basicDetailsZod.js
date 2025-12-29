import { z } from "zod";
import {
  RESIDENTIAL_PROPERTY_KEYS,
  COMMERCIAL_PROPERTY_KEYS,
} from "../screens/PostPropertyScreen/constants/subTypes";

/**
 * NOTE:
 * React Native does NOT have `File`
 * So we validate images as generic objects
 */

export const basicDetailsZod = z
  .object({
    listingType: z.enum(["buy", "rent", "lease"], {
      message: "Listing type is required",
    }),

    category: z.enum(["residential", "commercial", "land", "agricultural"], {
      message: "Category is required",
    }),

    propertyType: z.string().min(1, "Property type is required").optional(),

    images: z
      .array(
        z.object({
          uri: z.string(),
        })
      )
      .min(5, "Upload at least 5 images"),
  })
  .superRefine((data, ctx) => {
    const { category, propertyType } = data;

    // Residential & Commercial must have propertyType
    if (
      (category === "residential" || category === "commercial") &&
      !propertyType
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please select a valid ${category} property type`,
        path: ["propertyType"],
      });
      return;
    }

    if (category === "residential") {
      if (!RESIDENTIAL_PROPERTY_KEYS.includes(propertyType)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a valid residential property type",
          path: ["propertyType"],
        });
      }
    }

    if (category === "commercial") {
      if (!COMMERCIAL_PROPERTY_KEYS.includes(propertyType)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a valid commercial property type",
          path: ["propertyType"],
        });
      }
    }
  });
export const validateBasicDetails = (base, category, files) => {
  return basicDetailsZod.safeParse({
    listingType: base.listingType,
    category,
    propertyType: base.propertyType,
    images: files, // RN images (uri objects)
  });
};
