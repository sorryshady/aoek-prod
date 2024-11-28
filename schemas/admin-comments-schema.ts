import { z } from "zod";

export const adminCommentsSchema = z.object({
  adminComments: z.string().optional(),
});

export type AdminComments = z.infer<typeof adminCommentsSchema>;
