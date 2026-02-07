import { z } from "zod";

/* ---------------- Reusable Schemas ---------------- */

const borewellDetailsSchema = z.object({
  depthMeters: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(1, "Depth must be greater than 0")
  ),

  yieldLpm: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(1, "Yield must be greater than 0")
  ),

  drilledYear: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z
      .number()
      .min(1900, "Invalid year")
      .max(new Date().getFullYear(), "Invalid year")
  ),
});

/* ---------------- Agricultural Schema ---------------- */

export const agriculturalSchema = z
  .object({
    plantationAge: z
      .preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number().min(0).optional()
      ),

    /* ===== SOIL & WATER ===== */
    soilType: z.string().optional(),
    irrigationType: z.string().optional(),
    waterSource: z.string().optional(),

    /* ===== BOREWELL ===== */
    numberOfBorewells: z.preprocess(
      (val) => (val === "" || val === undefined ? 0 : Number(val)),
      z.number().min(0).optional()
    ),

    borewellDetails: borewellDetailsSchema.optional(),

    /* ===== CROP ===== */
    currentCrop: z.string().optional(),
    suitableFor: z.string().optional(),
    landShape: z.string().optional(),

    /* ===== LEGAL & ACCESS ===== */
    statePurchaseRestrictions: z.string().optional(),
    accessRoadType: z.string().optional(),

    /* ===== FEATURES ===== */
    boundaryWall: z.boolean().optional(),
    electricityConnection: z.boolean().optional(),

    /* ===== PRICE ===== */
    isPriceNegotiable: z.boolean().optional(),

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
  })
  .superRefine((data, ctx) => {
    /* ===== REQUIRED FIELDS ===== */
    if (!data.accessRoadType) {
      ctx.addIssue({
        path: ["accessRoadType"],
        code: z.ZodIssueCode.custom,
        message: "Access road type is required",
      });
    }

    if (!data.statePurchaseRestrictions) {
      ctx.addIssue({
        path: ["statePurchaseRestrictions"],
        code: z.ZodIssueCode.custom,
        message: "State purchase restrictions are required",
      });
    }

    /* ===== BOREWELL CONDITIONAL ===== */
    if ((data.numberOfBorewells ?? 0) > 0 && !data.borewellDetails) {
      ctx.addIssue({
        path: ["borewellDetails"],
        code: z.ZodIssueCode.custom,
        message: "Borewell details are required",
      });
    }
  });


export const validateAgriculturalProfile = (agricultural, images) => {
  return agriculturalSchema.safeParse({
    ...agricultural,
    images,
  });
};
