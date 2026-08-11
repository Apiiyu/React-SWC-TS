// Zod
import { z } from 'zod';

/**
 * @description Validates credentials before the login mutation reaches the API client.
 */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

/**
 * @description Inferred form values accepted by the authentication login flow.
 */
export type LoginSchema = z.infer<typeof loginSchema>;
