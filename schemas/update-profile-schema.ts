import { Department, Designation, District, UserStatus } from "@prisma/client";
import { z } from "zod";

export const updateProfileSchema = z.object({
  personalAddress: z
    .string()
    .min(1, { message: "Personal address is required" }),
  homeDistrict: z.nativeEnum(District),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
  mobileNumber: z
    .string()
    .min(10)
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
