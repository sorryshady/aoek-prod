import * as z from "zod";

export const promotionSchema = z.object({
  newPosition: z.string({
    required_error: "Please select a new position",
  }),
});

export const transferSchema = z.object({
  newWorkDistrict: z.string({
    required_error: "Please select a district",
  }),
  newOfficeAddress: z.string().min(1, "Office address is required"),
});

export type PromotionFormData = z.infer<typeof promotionSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;

export type RequestType = "promotion" | "transfer";
