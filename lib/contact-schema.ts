import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }),
  mobileNumber: z
    .string({
      required_error: "Mobile number is required",
    })
    .regex(
      /^(\+91)?\d{10}$/,
      "Mobile number must be exactly 10 digits or start with +91 followed by 10 digits",
    ),
  message: z
    .string()
    .min(10, { message: "Message must be atleast 10 characters long " }),
});

export default contactFormSchema;
