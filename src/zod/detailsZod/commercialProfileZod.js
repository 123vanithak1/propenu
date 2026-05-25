import { z } from "zod";

export const commercialProfileSchema = z
  .object({
    /* ===== AMENITIES ===== */
    amenities: z.array(z.string()).optional(),

    /* ===== PARKING ===== */
    parkingDetails: z
      .object({
        twoWheeler: z.preprocess(
          (val) => (val === "" || val === undefined ? 0 : Number(val)),
          z.number().min(0),
        ),
        fourWheeler: z.preprocess(
          (val) => (val === "" || val === undefined ? 0 : Number(val)),
          z.number().min(0),
        ),
      })
      .optional(),

    /* ===== FLOORING ===== */
    flooringType: z.string().optional(),

    /* ===== FLOORS ===== */
    floorNumber: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0).optional(),
    ),

    totalFloors: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0).optional(),
    ),

    /* ===== PANTRY ===== */
    pantry: z
      .object({
        type: z.string().optional(),
        insidePremises: z.boolean().optional(),
        shared: z.boolean().optional(),
      })
      .optional(),

    /* ===== PROPERTY AGE ===== */
    propertyAge: z.string().optional(),

    /* ===== BUILDING MANAGEMENT ===== */
    buildingManagement: z
      .object({
        managedBy: z.string().optional(),
        contact: z.string().optional(),
      })
      .optional(),

    /* ===== ZONING ===== */
    zoning: z.string().optional(),

    /* ===== FIRE SAFETY ===== */
    fireSafety: z
      .object({
        fireExtinguisher: z.boolean().optional(),
        fireSprinklerSystem: z.boolean().optional(),
        fireHoseReel: z.boolean().optional(),
        fireHydrant: z.boolean().optional(),
        smokeDetector: z.boolean().optional(),
        fireAlarmSystem: z.boolean().optional(),
        fireControlPanel: z.boolean().optional(),
        emergencyExitSignage: z.boolean().optional(),
      })
      .refine((obj) => Object.values(obj || {}).some(Boolean), {
        message: "Select at least one fire safety measure",
      })
      .optional(),

    /* ===== DESCRIPTION ===== */
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description too long")
      .optional(),

    /* ===== IMAGES (React Native) ===== */
    images: z
      .array(
        z.object({
          uri: z.string(),
          name: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .min(5, "Upload at least 5 images"),
  })
  .superRefine((data, ctx) => {
    if (data.floorNumber !== undefined && data.totalFloors !== undefined) {
      if (data.floorNumber > data.totalFloors - 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid floor number",
          path: ["floorNumber"],
        });
      }
    }
  });
export const validateCommercialProfile = (commercial, images) => {
  return commercialProfileSchema.safeParse({
    ...commercial,
    images,
  });
};
