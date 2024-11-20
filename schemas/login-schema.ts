import { SecurityQuestionType } from "@prisma/client";
import { z } from "zod";

export const EmailIdSchema = z.object({
  emailOrId: z.string().refine(
    (value) =>
      /^\d+$/.test(value) || // Check if it's a numeric membership ID
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Check if it's a valid email
    {
      message:
        "Input must be a valid email address or a numeric membership ID.",
    },
  ),
});

export const SignupSchema = z
  .object({
    question: z.nativeEnum(SecurityQuestionType),
    answer: z.string({ required_error: "Answer is required" }).min(1),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, { message: "Password should be at least 8 characters" }),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(8, { message: "Confirm password should be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
});
