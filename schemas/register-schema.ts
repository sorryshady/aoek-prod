import { z } from "zod";
import { parse, isValid } from "date-fns";
import {
  BloodGroup,
  Department,
  Designation,
  District,
  Gender,
  UserStatus,
} from "@prisma/client";

// Base Schema with file upload for photo
const baseRegisterSchema = z.object({
  // Personal Info
  name: z
    .string({ message: "Please enter your name" })
    .min(3, { message: "Name must be at least 3 characters" }),
  gender: z.nativeEnum(Gender, { message: "Please select a gender" }),
  bloodGroup: z.nativeEnum(BloodGroup),
  //   Employment and Professional address
  userStatus: z.nativeEnum(UserStatus),
  department: z.nativeEnum(Department).optional(),
  designation: z.nativeEnum(Designation).optional(),
  officeAddress: z.string().optional(),
  workDistrict: z.nativeEnum(District).optional(),
  // Personal Contact Address
  personalAddress: z
    .string()
    .min(1, { message: "Personal address is required" }),
  homeDistrict: z.nativeEnum(District),
  // Contact Information
  email: z.string().email(),
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
  // Photo
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 4 * 1024 * 1024, {
      // 4MB limit
      message: "File size should be less than 4MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Only JPEG, JPG, and PNG images are allowed",
      },
    )
    .optional(),
  photoId: z.string().optional(),
});

// function to validate address fields only if WORKING else all fields are optional
const validateFields = (data: z.infer<typeof baseRegisterSchema>) => {
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
};

// Schema for backend fields check by removing photo file and adding photoUrl field which can be empty.
export const backendRegisterSchema = baseRegisterSchema
  .omit({ photo: true })
  .extend({
    dob: z.date(),
    photoUrl: z.union([z.string().url(), z.literal("")]),
  })
  .refine(validateFields, {
    message:
      "Invalid Data: If working enter department, designation, office address and work district.",
  });

// Schema for frontend form validation
export const frontendRegisterSchema = baseRegisterSchema
  .extend({
    dob: z.string({ message: "Date of birth is required." }).refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) && date <= new Date() && date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
  })
  .refine(validateFields, {
    message:
      "Invalid Data: If working enter department, designation, office address and work district.",
  });

export type FrontendRegisterSchema = z.infer<typeof frontendRegisterSchema>;
export type BackendRegisterSchema = z.infer<typeof backendRegisterSchema>;
