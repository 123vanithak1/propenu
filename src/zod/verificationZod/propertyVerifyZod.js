import { z } from "zod";

export const PropertyVerifySchema = z.object({
  verificationDocuments: z
    .array(
      z.object({
        uri: z.string(),
        name: z.string().optional(),
        type: z.string().optional(),
      }),
      { message: "Verification document is required" }
    )
    .min(1, "Please upload a verification document"),
});

export const validatePropertyVerify = (data) => {
  return PropertyVerifySchema.safeParse({
    verificationDocuments: data?.verificationDocuments,
  });
};
