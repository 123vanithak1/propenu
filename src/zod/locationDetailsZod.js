import { z } from "zod";

/* ---------------- Nearby Place Schema ---------------- */

const nearbyPlaceSchema = z.object({
  name: z.string().min(1, "Place name is required"),
  type: z.string().optional(),
  distanceText: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()]).optional(), // [lng, lat]
  order: z.number().optional(),
});

/* ---------------- Location Schema ---------------- */

export const locationDetailsSchema = z
  .object({
    address: z.string({
      required_error: "Address must be at least 10 characters",
    }),

    locality: z.string({
      required_error: "Locality is required",
    }),

    city: z.string({
      required_error: "City is required",
    }),

    state: z.string({
      required_error: "State is required",
    }),

    pincode: z
      .string({ required_error: "Pincode is required" })
      .regex(/^\d+$/, "Pincode must contain only numbers")
      .length(6, "Pincode must be 6 digits"),

    buildingName: z.string().optional(),
    landName: z.string().optional(),

    location: z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    }).optional(),

    nearbyPlaces: z.array(nearbyPlaceSchema).optional(),
  })
  .superRefine((data, ctx) => {
    /* ================= BUILDING / LAND NAME ================= */

    if (!data.buildingName && !data.landName) {
      ctx.addIssue({
        path: ["buildingName"],
        code: z.ZodIssueCode.custom,
        message: "Building or land name is required",
      });
    }

    /* ================= LOCATION ================= */

    if (!data.location?.coordinates?.length) {
      ctx.addIssue({
        path: ["location"],
        code: z.ZodIssueCode.custom,
        message: "Please select location on map",
      });
    }
  });

/* ---------------- Validator ---------------- */

export const validateLocationDetails = (base) => {
  return locationDetailsSchema.safeParse({
    address: base?.address,
    locality: base?.locality,
    city: base?.city,
    state: base?.state,
    pincode: base?.pincode,
    buildingName: base?.buildingName,
    landName: base?.landName,
    location: base?.location,
    nearbyPlaces: base?.nearbyPlaces,
  });
};

/* ---------------- Error Helper ---------------- */

export const getLocationFieldError = (fieldErrors, fieldName) => {
  return fieldErrors?.[fieldName]?.[0];
};
