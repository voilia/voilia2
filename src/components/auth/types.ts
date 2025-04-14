
import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().optional(),
});

export type AuthFormValues = z.infer<typeof authSchema>;
