import { z } from "zod";

/* ---------------- Nearby Place Schema ---------------- */

const nearbyPlaceSchema = z.object({
  name: z.string().min(1, "Place name is required"),
  type: z.string().optional(),
  distanceText: z.string().optional(),

  // [longitude, latitude]
  coordinates: z
    .tuple([z.number(), z.number()])
    .optional(),

  order: z.number().optional(),
});

/* ---------------- Location Schema ---------------- */

export const locationDetailsSchema = z.object({
  address: z
    .string()
    .min(10, "Address must be at least 10 characters"),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),

  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.number(), // longitude
      z.number(), // latitude
    ]),
  }),

  nearbyPlaces: z.array(nearbyPlaceSchema).optional(),
});
export const validateLocationDetails = (base) => {
  return locationDetailsSchema.safeParse({
    address: base.address,
    city: base.city,
    state: base.state,
    pincode: base.pincode,
    location: base.location,
    nearbyPlaces: base.nearbyPlaces,
  });
};