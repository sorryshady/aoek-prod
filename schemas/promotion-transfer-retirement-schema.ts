import * as z from "zod";
import { parse, isValid } from "date-fns";

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

export const retirementSchema = z.object({
  retirementDate: z
    .string({ message: "Retirement date is required." })
    .refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) && date <= new Date() && date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
});

export type PromotionFormData = z.infer<typeof promotionSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;
export type RetirementFormData = z.infer<typeof retirementSchema>;

export type RequestType = "promotion" | "transfer" | "retirement";
