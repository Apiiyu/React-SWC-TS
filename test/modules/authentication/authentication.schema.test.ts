import { describe, expect, it } from "vitest";

import { loginSchema } from "@/modules/authentication/schemas/authentication.schema";

describe("loginSchema", () => {
  it("accepts a valid email and an 8+ character password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "supersecret",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "supersecret",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});
