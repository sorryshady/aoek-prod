import { z } from "zod";

export const photoSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 4 * 1024 * 1024, {
    message: "File size should be less than 4MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
    {
      message: "Only JPEG, JPG, and PNG images are allowed",
    }
  );
