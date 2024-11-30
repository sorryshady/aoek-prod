import { z } from "zod";

export const forgotPasswordSchema = z
  .object({
    answer: z.string().min(1, { message: "Answer is required" }).min(1),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password should be at least 8 characters" }),

    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, { message: "Confirm password should be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
