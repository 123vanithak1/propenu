import { z } from "zod";

/* ---------------- Reusable enums ---------------- */

export const FacingEnum = z.enum([
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
]);

export const LayoutTypeEnum = z.enum([
  "approved-layout",
  "unapproved-layout",
  "gated-layout",
  "individual-plot",
]);

/* ---------------- Land Schema ---------------- */

export const landProfileSchema = z.object({
  /* ===== LAYOUT TYPE (REQUIRED) ===== */
  layoutType: z.preprocess(
    (val) => val ?? "",
    z
      .string()
      .nonempty("Please select one option")
      .pipe(LayoutTypeEnum)
  ),

  /* ===== FACING ===== */
  facing: FacingEnum.optional(),

  /* ===== AMENITIES ===== */
  amenities: z.array(z.string()).optional(),

  /* ===== LAND DETAILS ===== */
  surveyNumber: z.string().max(50, "Survey number is too long").optional(),
  landUseZone: z.string().max(100, "Land use zone is too long").optional(),

  /* ===== PLOT FEATURES & UTILITIES ===== */
  readyToConstruct: z.boolean().optional(),
  waterConnection: z.boolean().optional(),
  electricityConnection: z.boolean().optional(),
  cornerPlot: z.boolean().optional(),
  fencing: z.boolean().optional(),

  /* ===== PRICING ===== */
  isPriceNegotiable: z.boolean().default(false),

  /* ===== DESCRIPTION ===== */
  description: z.preprocess(
    (val) => val ?? "",
    z
      .string()
      .nonempty("Description is required")
      .min(30, "Description must be at least 30 characters long")
  ),

  /* ===== IMAGES (React Native format) ===== */
  images: z
    .array(
      z.object({
        uri: z.string(),
        name: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .min(5, "Upload at least 5 images"),
});


export const validateLandProfile = (land, images) => {
  return landProfileSchema.safeParse({
    ...land,
    images,
  });
};
