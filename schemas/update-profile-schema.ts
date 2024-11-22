import { Department, Designation, District, UserStatus } from "@prisma/client";
import { z } from "zod";

export const updateProfileSchema = z
  .object({
    userStatus: z.nativeEnum(UserStatus),
    department: z.nativeEnum(Department).optional(),
    designation: z.nativeEnum(Designation).optional(),
    officeAddress: z.string().optional(),
    workDistrict: z.nativeEnum(District).optional(),
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
  })
  .refine(
    (data) => {
      if (data.userStatus === UserStatus.WORKING) {
        return (
          data.department &&
          data.designation &&
          data.officeAddress &&
          data.workDistrict
        );
      } else if (
        data.userStatus === UserStatus.RETIRED ||
        data.userStatus === UserStatus.EXPIRED
      ) {
        return (
          !data.department &&
          !data.designation &&
          !data.officeAddress &&
          !data.workDistrict
        );
      }
      return true;
    },
    {
      message:
        "Invalid Data: If working enter department, designation, office address and work district.",
    },
  );

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
