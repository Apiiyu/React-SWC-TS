// Zod
import { z } from "zod";

const envSchema = z.object({
  VITE_APP_BASE_API_URL: z.url().optional(),
});

/**
 * @description Validates `import.meta.env` once at module load — fails fast
 * with a readable error instead of silently shipping an unset/malformed API URL.
 */
export const env = envSchema.parse(import.meta.env);
