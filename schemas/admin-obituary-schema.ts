import { isValid, parse } from "date-fns";
import { z } from "zod";

export const obituarySchema = z.object({
  dateOfDeath: z
    .string({ message: "Retirement date is required." })
    .refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) && date <= new Date() && date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
  additionalNote: z.string().optional(),
});

export type ObituarySchema = z.infer<typeof obituarySchema>;
