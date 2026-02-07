import { z } from "zod";

export const commercialVerifySchema = z.object({
  /* ===== RERA ===== */
  reraRegistrationNumber: z
    .string()
    .nonempty("RERA registration number is required"),

  /* ===== APPROVALS ===== */
  approvals: z
    .array(z.string())
    .min(1, "Select at least one approval"),
});
export const validateCommercialVerify = (data) => {
  return commercialVerifySchema.safeParse(data);
};
